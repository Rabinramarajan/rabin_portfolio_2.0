import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

/** Visible breadcrumb nav paired with matching BreadcrumbList schema. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <>
      <BreadcrumbJsonLd trail={trail} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map((crumb, i) =>
            i === trail.length - 1 ? (
              <li key={crumb.path} aria-current="page">
                {crumb.name}
              </li>
            ) : (
              <li key={crumb.path}>
                <Link href={crumb.path}>{crumb.name}</Link>
              </li>
            ),
          )}
        </ol>
      </nav>
    </>
  );
}
