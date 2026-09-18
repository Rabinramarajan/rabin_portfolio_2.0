/** Adapted from the Fiji project decisions and the published RxJS writeup. */
export const homeCaseStudy = {
  projectSlug: "fiji-immigration-internal",
  title: "Behind the ~40% reduction in API consumption",
  sections: [
    {
      title: "The problem appeared when panels came together",
      paragraphs: [
        "On the Fiji Immigration internal management system, an officer works with several parts of a case at once: applicant history, document status, reference data and an audit trail. The Angular interface brings those panels together so the officer can assess an application without losing the surrounding context. I worked on the frontend architecture, API integration, reusable components and data flows as part of the delivery team.",
        "Each panel had been built to request the data it needed independently. That made sense in isolation, but several panels needed the same reference lookups. Opening a case therefore triggered repeated calls to the same endpoints. The issue sat in how the screen composed its data, so changing one panel would have left the same pattern elsewhere.",
      ],
    },
    {
      title: "Share the request at the data layer",
      paragraphs: [
        "I moved the reference lookups behind a shared RxJS stream with caching. When several panels need the same lookup, they subscribe to one in-flight request. The returned value can then serve subsequent subscribers without another call for the same reference data. The panels remain separate components; the service owns the shared work.",
        "The linked implementation writeup explains the stream-sharing pattern and its trade-offs. The useful architectural change is where the request lives: a reusable data layer can coordinate consumers that do not know about one another. Fixing duplication there addresses the whole composed screen and avoids copying request-management logic into every panel.",
      ],
    },
    {
      title: "Freshness is part of the design",
      paragraphs: [
        "Caching creates a second responsibility: deciding when a stored value is no longer current. Reference data can change during a session, so the project invalidates the cache on workflow events that can affect it. Holding every response for the lifetime of a page would make fewer requests, but could leave an officer working with stale information.",
        "This distinction matters in a government workflow. A successful optimization must preserve the application’s behaviour as a case moves between stages and roles. Shared reference lookups are a specific boundary for reuse; they are not a reason to cache every response indiscriminately. Ownership and invalidation belong alongside the request-sharing decision.",
      ],
    },
    {
      title: "What the reported results establish",
      paragraphs: [
        "The project reports approximately 40% lower API consumption against the earlier frontend data flow. It also reports approximately 50% improved frontend performance from rendering and workflow optimization, on a platform serving more than 10,000 active users. The broader performance figure should not be attributed to request sharing alone.",
        "These are approximate project outcomes. The public case study does not publish raw benchmark logs, a device matrix or a Core Web Vitals comparison. What it does provide is the problem, my scope, the chosen mechanism and the freshness trade-off, giving a prospective team something concrete to discuss when evaluating similar Angular work.",
      ],
    },
  ],
};
