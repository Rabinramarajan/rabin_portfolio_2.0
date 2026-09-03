# Deploy — Kustomize + ArgoCD

GitOps delivery for the portfolio container. Git decides what runs; nothing here
is applied by hand, and no workflow talks to the cluster.

Images come from the registry this project already publishes to:

```
vcr.vercel.com/rabin-projects/rabin-portfolio-2-0/rabin_portfolio_prod
```

This sits **alongside** the Vercel-hosted site, which is unchanged. Vercel stays
live unless you point DNS at the cluster ingress.

## Layout

```
deploy/
  base/                  Deployment, Service, ConfigMap — cluster-agnostic
  overlays/
    staging/             namespace portfolio-staging, 1 replica, noindex ingress
    production/          namespace portfolio, HPA + PDB + rollout policy
  argocd/                AppProject and the two Applications
```

## Flow

Images are built and pushed **from a developer machine** by `npm run publish`,
exactly as before. No registry credentials live in GitHub — the same constraint
[ci.yml](../.github/workflows/ci.yml) was written around. So the release
workflow builds nothing; it only syncs tags.

[publish/config.json](../publish/config.json) is the source of truth, and its
two entries map straight onto the two overlays:

| `publish/config.json` | Overlay | Namespace | ArgoCD app |
| --- | --- | --- | --- |
| `demo.version` | `overlays/staging` | `portfolio-staging` | `portfolio-staging` |
| `prod.version` | `overlays/production` | `portfolio` | `portfolio-production` |

Releasing:

```sh
npm run publish prod            # builds + pushes vcr...:v1.0.5, updates config.json
git add publish/config.json publish/build-log-prod.txt package.json \
        src/generated/version.json
git commit -m "release: v1.0.5" && git push
```

[.github/workflows/release.yml](../.github/workflows/release.yml) fires on that
`publish/config.json` change, runs `kustomize edit set image` on both overlays,
and commits the result. ArgoCD sees the commit and syncs.

Staging works the same way via `npm run publish demo` — it does **not** auto-build
on every push to `main`, because nothing in CI can push to `vcr.vercel.com`.

**Rollback is `git revert` of the bump commit.** Never `kubectl set image` —
`selfHeal: true` will undo it within minutes.

Only immutable `v*` tags are deployed, never `:latest`. A mutable tag would make
a git revert meaningless, since the same tag could resolve to a different image.

CI enforces that the overlays and `publish/config.json` agree; if they drift, the
cluster is running something other than the recorded release.

## One-time setup

0. **A cluster with ArgoCD on it.** `Application` and `AppProject` are CRDs — on
   a cluster without ArgoCD, applying them fails with `unable to recognize`.
   Without any cluster at all, kubectl falls back to `localhost:8080` and fails
   with `connection refused` before it validates anything.

   ```sh
   kubectl config current-context   # errors if no cluster is configured

   kubectl create namespace argocd
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   kubectl -n argocd wait --for=condition=available deploy/argocd-server --timeout=300s
   ```

   On Docker Desktop, enable Kubernetes in Settings first. A local cluster has
   no ingress-nginx or cert-manager, so the Ingress objects stay inert — reach
   the app with `kubectl -n portfolio port-forward svc/portfolio 3000:80`.

1. **Install the ArgoCD objects:**

   ```sh
   kubectl apply -f deploy/argocd/project.yaml
   kubectl apply -f deploy/argocd/application-staging.yaml
   kubectl apply -f deploy/argocd/application-production.yaml
   ```

2. **Registry pull secret.** `vcr.vercel.com` is private, so the Deployment
   references a secret named `vcr-pull`. It must exist in **both** namespaces —
   image pull secrets are namespaced and are not inherited:

   ```sh
   for ns in portfolio portfolio-staging; do
     kubectl create namespace "$ns" --dry-run=client -o yaml | kubectl apply -f -
     kubectl -n "$ns" create secret docker-registry vcr-pull \
       --docker-server=vcr.vercel.com \
       --docker-username="$VERCEL_USERNAME" \
       --docker-password="$VERCEL_TOKEN"
   done
   ```

   Use the same credentials your local `docker login vcr.vercel.com` uses. If a
   pod sits in `ImagePullBackOff`, this secret is the first thing to check.

3. **Application secrets.** Nothing secret is committed. The Deployment reads an
   optional Secret named `portfolio-secrets`; create it per namespace from the
   env vars the app actually uses:

   ```sh
   kubectl -n portfolio create secret generic portfolio-secrets \
     --from-literal=BLOB_READ_WRITE_TOKEN=... \
     --from-literal=BLOB_UPLOAD_SECRET=... \
     --from-literal=GEMINI_API_KEY=... \
     --from-literal=GROQ_API_KEY=...
   ```

   `NEXT_PUBLIC_*` values are inlined at build time, not read from the Secret —
   they must be set as build args in the image build if you need them to differ
   per environment.

4. **Ingress hosts.** `rabin.dev` / `staging.rabin.dev` in the two `ingress.yaml`
   files are placeholders. They assume ingress-nginx and cert-manager with a
   `letsencrypt-prod` ClusterIssuer; change the class and annotations if your
   cluster uses something else.

## Working on the manifests

```sh
kubectl kustomize deploy/overlays/production          # render
kubectl apply --dry-run=server -k deploy/overlays/production
```

CI renders every overlay on each PR, so a broken kustomization fails before it
can reach a cluster.

## Notes on the base

- `readOnlyRootFilesystem: true`, so `/app/.next/cache` and `/tmp` are mounted as
  emptyDirs — Next writes its image-optimizer cache at runtime.
- Probes hit `/api/health`, which does no I/O on purpose: readiness should answer
  "is this process serving?", not "is every upstream up?".
- Memory has a limit, CPU does not. Throttling a request-driven Node process
  costs more in p99 latency than the noisy-neighbour risk is worth.
- Production's `spec.replicas` is ignored by ArgoCD because the HPA owns it.
- The image is `linux/amd64` only (that is what `publish.js` builds). On an ARM
  node it will fail to pull with an architecture mismatch.
