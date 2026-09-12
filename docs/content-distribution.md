# Content distribution and search monitoring

The site now publishes articles that are worth reading; nothing about publishing
them makes anyone read them. This is the routine that does, plus the weekly
Search Console pass that tells you which page to improve next.

Written for: Rabin, running this solo. Everything here is a repeatable
15-minute job, not a marketing programme.

## Per-article routine

| Day | Where | What |
|---|---|---|
| 1 | rabinr.in | Publish. Add `datePublished`, the `related` links, and the `cta`. |
| 2 | LinkedIn | Short version — one idea, not a summary. Link in the first comment or the post, either is fine; the post text has to stand alone. |
| 4 | Dev.to / Hashnode | Adapted version with `canonical_url` pointing at rabinr.in. Both platforms support it; set it or the copy competes with the original. |
| 7 | LinkedIn | A second post using one detail from the article — usually the trade-off or the thing that was surprising. Link at the end. |

The rule that matters: the LinkedIn post is not an advert for the article. It
has to be worth reading if nobody clicks. Open with the concrete situation,
give away the actual answer, then link for the workings.

## Ready to post

### "The same request, five times" — `/insights/rxjs-reduce-api-calls`

**Day 2, LinkedIn:**

> We did not have a backend performance problem. We had four panels each doing
> the polite thing.
>
> A government case system I worked on was slow to open a record. The obvious
> suspects were all innocent — the bundle was fine, lazy loading was already in
> place, the component count was reasonable.
>
> The network tab, sorted by name, showed the same three reference endpoints
> being requested five and six times per navigation.
>
> Nobody had been careless. Every panel on the screen had been built to be
> self-sufficient: fetch what you need on init, do not assume a parent loaded it.
> That is the rule that makes panels reusable. It also means four panels that
> need the country list fetch the country list four times.
>
> The fix was one shared, cached stream in the service. Not one component
> changed. API consumption dropped by about 40%, load time by roughly half.
>
> Before optimising anything: sort the network tab by name and count the
> duplicates. A URL that appears more than once per navigation is work that
> costs nothing to remove.
>
> Full write-up, with the code and the cache-invalidation problem it creates:
> rabinr.in/insights/rxjs-reduce-api-calls

**Day 7, LinkedIn** — the trade-off angle:

> Caching reference data in an Angular app is easy. Deciding when the cache is
> wrong is the actual work.
>
> A stale list does not fail loudly. It reaches production quietly and surfaces
> weeks later as "why does the dropdown not show the new office".
>
> A TTL would have been less code. It also would have meant either stale data
> for its duration, or pointless requests forever. So the cache is cleared by
> the events that can change the data — an admin editing a category, a new
> office being registered — and nothing else.
>
> Timers are a way of not deciding. [link]

### "The order you check things in" — `/insights/angular-performance-checklist`

**Day 2, LinkedIn:**

> Most Angular performance checklists are a list of everything that can be slow.
> That is a reference, not a procedure — so teams work down it alphabetically
> and spend a week on lazy loading for an app whose problem was never the bundle.
>
> Mine is ordered by how often each item turns out to be the cause:
>
> 0. Reproduce it on hardware a user actually owns.
> 1. Duplicate and serial requests.
> 2. Change detection — what the profiler names, not what grep finds.
> 3. What is in the bundle, and whether lazy loading is real.
> 4. Rendering.
>
> Stop at the first one that explains what you are seeing.
>
> And the item that is not on the list: sometimes the profile says the time is
> in the API, and no amount of Angular work will fix it. Saying that in week one
> is worth more than a month of tuning the wrong layer. [link]

## Weekly Search Console pass (15 minutes)

Submit `https://www.rabinr.in/sitemap.xml` once, then each week:

1. **Pages → Indexed / Not indexed.** Anything valuable in "Not indexed" is the
   first thing to fix. Expect the scheduled insights to sit in "Discovered —
   currently not indexed" until their publish date passes; that is correct
   behaviour, not a problem.
2. **Performance → Queries**, last 28 days. Filter to positions 5–20 and sort by
   impressions. Those are the pages Google already believes in and is not quite
   ranking — the cheapest wins on the whole site.
3. For each one, do exactly one thing: tighten the `<title>` to match the query,
   add the missing section the query implies, or add an internal link to it from
   a page that already ranks. Then leave it alone for a month.
4. **Check the redirects landed** after any deploy that renames a URL. The
   service and insight renames in this branch are in `next.config.ts`; a 301
   that silently became a 404 is the one SEO mistake that undoes everything else.

Do not track rankings daily. The signal is monthly at best, and watching it
daily produces changes that have no evidence behind them.

## Cadence

Two articles a month, from the priority list, written the same way every time:

> problem from a real project → the decision → the code or pattern → the result
> → the lesson

Not tutorials. There are ten thousand Angular tutorials and none of them can say
"this is what it cost on a government case system", which is the only thing here
that cannot be copied.
