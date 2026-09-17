import type { Insight } from "@/content/types";

// Imported from https://www.linkedin.com/pulse/i-stopped-writing-angular-old-way-10-modern-patterns-use-rabin-r-2n77c/
export const modernAngularPatterns: Insight = {
  "id": "stopped-writing-angular-old-way-10-modern-patterns",
  "number": "12",
  "title": "I Stopped Writing Angular the Old Way: 10 Modern Angular Patterns I Use in 2026",
  "topic": "Architecture",
  "datePublished": "2026-09-17",
  "seoTitle": "10 Modern Angular Patterns I Use in 2026",
  "seoDescription": "A practical guide to Angular Signals, computed state, inject, standalone architecture, Signal Forms, RxJS, defer and zoneless change detection.",
  "dek": "The modern Angular patterns I use in 2026, why I use them, and when I would choose something else. A practical guide to clearer state, dependencies, forms, rendering and feature architecture.",
  "cover": {
    "src": "/media/insights/stopped-writing-angular-old-way-10-modern-patterns/cover.webp",
    "alt": "Modern Angular patterns: Signals, computed, inject, Signal Forms, RxJS, defer and zoneless rendering.",
    "width": 1730,
    "height": 909
  },
  "pullQuote": "Choose the simplest abstraction that clearly communicates the problem.",
  "takeaways": [
    "Use Signals for local state and computed() for values derived from it.",
    "Keep RxJS for asynchronous streams, cancellation and event composition.",
    "Give features clear ownership and reusable components focused responsibilities.",
    "Use deferred rendering and explicit reactivity where they improve the user experience."
  ],
  "related": [
    {
      "label": "Angular Signals for State Management",
      "href": "/insights/angular-signals-state-management"
    },
    {
      "label": "RxJS: Reducing Duplicate API Calls",
      "href": "/insights/rxjs-reduce-api-calls"
    },
    {
      "label": "Angular Zoneless Change Detection",
      "href": "/insights/angular-zoneless-change-detection"
    },
    {
      "label": "Accessible Angular Forms",
      "href": "/insights/accessible-angular-forms"
    },
    {
      "label": "Angular Performance Checklist",
      "href": "/insights/angular-performance-checklist"
    },
    {
      "label": "Angular Codebase Audit",
      "href": "/insights/angular-codebase-audit"
    }
  ],
  "body": [
    "Angular has changed significantly.",
    "But the biggest change isn't simply a new API.",
    "It's the way we think about state, dependencies, rendering, forms, performance, and frontend architecture.",
    "Many Angular applications are still being built with patterns that made sense several years ago:",
    {
      "type": "list",
      "items": [
        "NgModules everywhere",
        "Constructor-heavy dependency injection",
        "*ngIf and *ngFor",
        "RxJS for almost every piece of state",
        "Reactive Forms for every form",
        "Manual subscriptions",
        "Zone.js-driven change detection"
      ]
    },
    "None of these patterns suddenly became bad.",
    "But modern Angular gives us more focused tools for many of the problems they were solving.",
    "When I build Angular applications today, I try to follow one principle:",
    {
      "type": "aside",
      "text": "Make state explicit, keep reactivity close to where it is used, and remove unnecessary complexity."
    },
    "That shift has changed not only how my Angular code looks, but also how I approach frontend architecture, reusable components, performance, and maintainability.",
    "In this article, I'll walk through 10 modern Angular patterns I use in 2026 — and, more importantly, explain why I use them and when I wouldn't.",
    {
      "type": "subheading",
      "text": "What You'll Learn"
    },
    "By the end of this article, you'll have a practical mental model for:",
    {
      "type": "list",
      "items": [
        "Angular Signals and local application state",
        "computed() and derived state",
        "inject() and dependency management",
        "Standalone-first Angular architecture",
        "Built-in template control flow",
        "Signal Forms",
        "Signal-based component inputs",
        "Signals and RxJS together",
        "@defer and frontend performance",
        "Zoneless Angular",
        "Feature boundaries and reusable UI architecture"
      ]
    },
    {
      "type": "heading",
      "text": "Modern Angular Architecture at a Glance"
    },
    "Before looking at individual APIs, here's the mental model I use when designing a modern Angular application:",
    {
      "type": "code",
      "language": "html",
      "code": "                          MODERN ANGULAR\n                                │\n              ┌─────────────────┼─────────────────┐\n              │                 │                 │\n            STATE             EVENTS          RENDERING\n              │                 │                 │\n          Signals             RxJS             @defer\n              │                 │                 │\n         computed()       HTTP / Streams       Priority\n              │                 │                 │\n              └─────────────────┼─────────────────┘\n                                │\n                       FEATURE ARCHITECTURE\n                                │\n                    Standalone + Clear Boundaries\n                                │\n                                ▼\n                       Maintainable UI"
    },
    "The important part isn't using every API.",
    "It's understanding which abstraction should own which responsibility.",
    {
      "type": "heading",
      "text": "1. Angular Signals for Local Application State"
    },
    "One of the biggest changes in my Angular code is simple:",
    "I don't automatically reach for an Observable every time a value can change.",
    "Consider a basic counter:",
    {
      "type": "code",
      "language": "typescript",
      "code": "loading = false;\ncount = 0;"
    },
    "These values work perfectly well as properties.",
    "But once other parts of the UI depend on them, we need a clear reactive relationship.",
    "Signals make that relationship explicit.",
    {
      "type": "code",
      "language": "typescript",
      "code": "import { computed, signal } from '@angular/core';\n\ncount = signal(0);\n\ndoubledCount = computed(() => this.count() * 2);\n\nincrement() {\n  this.count.update(value => value + 1);\n}"
    },
    "Now the architecture is easy to understand:",
    {
      "type": "code",
      "language": "typescript",
      "code": "count\n  ↓\nsignal()\n  ↓\ncomputed()\n  ↓\nUI"
    },
    "count is the source of truth.",
    "doubledCount derives from that source.",
    "When count changes, Angular can react to the relevant dependency.",
    "The important improvement isn't simply shorter code.",
    "It's explicit dependency management.",
    {
      "type": "subheading",
      "text": "My Current Mental Model"
    },
    {
      "type": "code",
      "language": "typescript",
      "code": "Signals\n   ↓\nSynchronous application / UI state\n\ncomputed()\n   ↓\nDerived state\n\nRxJS\n   ↓\nAsynchronous streams and event composition"
    },
    "Signals didn't make RxJS obsolete.",
    "They made me more intentional about when I actually need RxJS.",
    {
      "type": "subheading",
      "text": "When I Use Signals"
    },
    "I generally use Signals when the state is:",
    {
      "type": "list",
      "items": [
        "synchronous",
        "directly consumed by the UI",
        "local to a component or feature",
        "easy to represent as reactive state"
      ]
    },
    {
      "type": "subheading",
      "text": "When I Don't"
    },
    "I don't use Signals simply because they're newer.",
    "If I'm dealing with complex asynchronous streams, event composition, cancellation, debouncing, or stream transformations, RxJS may still be the clearer abstraction.",
    {
      "type": "subheading",
      "text": "My Rule"
    },
    {
      "type": "aside",
      "text": "Use Signals for state. Use RxJS when the problem is genuinely a stream."
    },
    {
      "type": "heading",
      "text": "2. Angular computed() for Derived State"
    },
    "One frontend problem that looks harmless can create difficult bugs later:",
    "storing values that can already be calculated.",
    "Imagine:",
    {
      "type": "code",
      "language": "typescript",
      "code": "firstName = signal('Rabin');\nlastName = signal('R');\n\nfullName = signal('');"
    },
    "Now fullName needs to stay synchronized whenever either source changes.",
    "But fullName isn't really independent state.",
    "It's a calculation.",
    "So I prefer:",
    {
      "type": "code",
      "language": "typescript",
      "code": "firstName = signal('Rabin');\nlastName = signal('R');\n\nfullName = computed(\n  () => `${this.firstName()} ${this.lastName()}`\n);"
    },
    "Now there is only one direction of data flow:",
    {
      "type": "code",
      "language": "typescript",
      "code": "firstName ──┐\n            ├──→ computed() ──→ fullName\nlastName ───┘"
    },
    "There is:",
    {
      "type": "list",
      "items": [
        "no manual synchronization",
        "no second mutable source of truth",
        "less opportunity for inconsistent state"
      ]
    },
    "This has become one of my most useful frontend rules:",
    {
      "type": "aside",
      "text": "If a value can be calculated from existing state, derive it instead of storing another mutable copy."
    },
    {
      "type": "subheading",
      "text": "When I Use computed()"
    },
    "Use it for things like:",
    {
      "type": "list",
      "items": [
        "filtered lists",
        "display labels",
        "calculated totals",
        "UI visibility",
        "derived permissions",
        "formatted values",
        "combined state"
      ]
    },
    "For example:",
    {
      "type": "code",
      "language": "typescript",
      "code": "products = signal<Product[]>([]);\n\nactiveProducts = computed(() =>\n  this.products().filter(product => product.active)\n);"
    },
    "Instead of manually maintaining both products and activeProducts, the relationship stays explicit.",
    {
      "type": "heading",
      "text": "3. inject() for Cleaner Angular Dependency Injection"
    },
    "Traditional Angular dependency injection usually looks like this:",
    {
      "type": "code",
      "language": "typescript",
      "code": "constructor(\n  private userService: UserService,\n  private router: Router,\n  private analytics: AnalyticsService\n) {}"
    },
    "This is still understandable and valid.",
    "But in modern Angular code, I increasingly prefer:",
    {
      "type": "code",
      "language": "typescript",
      "code": "private readonly userService = inject(UserService);\nprivate readonly router = inject(Router);\nprivate readonly analytics = inject(AnalyticsService);"
    },
    "Why?",
    "Because dependencies stay close to where the class fields are defined.",
    "The constructor remains available for actual initialization logic.",
    "And inject() works naturally with Angular's increasingly functional APIs.",
    "For example:",
    {
      "type": "code",
      "language": "text",
      "code": "export const canAccessDashboard = () => {\n  const auth = inject(AuthService);\n  const router = inject(Router);\n\n  return auth.isAuthenticated()\n    ? true\n    : router.createUrlTree(['/login']);\n};"
    },
    "The difference may look small inside one component.",
    "Across a large codebase, however, these small reductions in ceremony can make the architecture easier to scan.",
    {
      "type": "subheading",
      "text": "When I Use inject()"
    },
    "I particularly like it when working with:",
    {
      "type": "list",
      "items": [
        "functional guards",
        "interceptors",
        "providers",
        "standalone APIs",
        "functional configuration",
        "components with several dependencies"
      ]
    },
    "I don't use it simply because it's newer.",
    "I use it where it makes dependencies and composition clearer.",
    {
      "type": "heading",
      "text": "4. Standalone-First Angular Architecture"
    },
    "Older Angular architecture often started with:",
    {
      "type": "aside",
      "text": "Which NgModule should this component belong to?"
    },
    "My preferred question today is:",
    {
      "type": "aside",
      "text": "What does this feature actually depend on?"
    },
    "A standalone component makes that relationship easier to see.",
    {
      "type": "code",
      "language": "typescript",
      "code": "@Component({\n  selector: 'app-user-card',\n  standalone: true,\n  imports: [\n    DatePipe,\n    AvatarComponent\n  ],\n  templateUrl: './user-card.html'\n})\nexport class UserCardComponent {}"
    },
    "The component explicitly declares what it needs.",
    "This also influences how I structure applications.",
    "Instead of organizing everything around technical file types, I prefer keeping related functionality together.",
    {
      "type": "code",
      "language": "text",
      "code": "src/\n└── app/\n    ├── features/\n    │   ├── users/\n    │   │   ├── pages/\n    │   │   ├── components/\n    │   │   ├── services/\n    │   │   └── models/\n    │   │\n    │   └── dashboard/\n    │       ├── pages/\n    │       ├── components/\n    │       └── data-access/\n    │\n    └── shared/\n        ├── ui/\n        └── utilities/"
    },
    "The exact folder names aren't the important part.",
    "Clear ownership is.",
    "One mistake I've seen in frontend projects is allowing shared/ to slowly become a place where everything goes.",
    "Eventually, nobody knows which feature owns which responsibility.",
    "Standalone-first architecture works best when it's combined with strong feature boundaries.",
    {
      "type": "subheading",
      "text": "Feature Ownership"
    },
    "A good feature should make it easy to answer:",
    {
      "type": "list",
      "items": [
        "Who owns this state?",
        "Who owns this API logic?",
        "Which components belong to this feature?",
        "Which UI is genuinely reusable?",
        "What should remain private to the feature?"
      ]
    },
    "That is more important than having the perfect folder structure.",
    {
      "type": "heading",
      "text": "5. Angular Built-In Control Flow"
    },
    {
      "type": "image",
      "src": "/media/insights/stopped-writing-angular-old-way-10-modern-patterns/traditional-vs-modern-angular.webp",
      "alt": "Traditional Angular architecture compared with explicit reactive state and focused components in modern Angular.",
      "width": 1586,
      "height": 992
    },
    "Angular templates have also become easier to read.",
    "Previously, a list with an empty state might look like:",
    {
      "type": "code",
      "language": "html",
      "code": "<div *ngIf=\"users.length; else empty\">\n  <div *ngFor=\"let user of users\">\n    {{ user.name }}\n  </div>\n</div>\n\n<ng-template #empty>\n  <p>No users found.</p>\n</ng-template>"
    },
    "Today I prefer:",
    {
      "type": "code",
      "language": "html",
      "code": "@if (users().length) {\n\n  @for (user of users(); track user.id) {\n    <app-user-card [user]=\"user\" />\n  } @empty {\n    <p>No users found.</p>\n  }\n\n}"
    },
    "Angular's built-in control flow gives us:",
    {
      "type": "code",
      "language": "html",
      "code": "@if\n@else\n@for\n@empty\n@switch\n@case"
    },
    "The benefit isn't simply replacing *ngIf with @if.",
    "The template now communicates its control flow more directly.",
    "I especially like:",
    {
      "type": "code",
      "language": "html",
      "code": "@for (user of users(); track user.id) {\n  <app-user-card [user]=\"user\" />\n}"
    },
    "because identity tracking is visible directly where the iteration happens.",
    "Good templates should tell a story about the UI without forcing another developer to mentally reconstruct the control flow.",
    {
      "type": "heading",
      "text": "6. Angular Signal Forms for Signal-First Form State"
    },
    "Forms are one of the interesting areas of modern Angular.",
    "For years, many Angular applications have been structured around this mental model:",
    {
      "type": "code",
      "language": "text",
      "code": "FormGroup\n    ↓\nFormControl\n    ↓\nValidators\n    ↓\nvalueChanges\n    ↓\nTemplate"
    },
    "Signal Forms introduce a different way to think about the problem:",
    {
      "type": "code",
      "language": "typescript",
      "code": "Writable Signal Model\n        ↓\n      form()\n        ↓\n    Field Tree\n        ↓\nValidation Schema\n        ↓\n    Field State\n        ↓\n       UI"
    },
    "The difference is important.",
    "The data model becomes the starting point.",
    {
      "type": "image",
      "src": "/media/insights/stopped-writing-angular-old-way-10-modern-patterns/signal-forms.webp",
      "alt": "Signal Forms architecture from writable model to field tree, validation, field state and accessible reusable inputs.",
      "width": 1536,
      "height": 1024
    },
    {
      "type": "subheading",
      "text": "Building a Registration Form"
    },
    "Imagine I'm creating a simple account registration experience.",
    "First, I define the model:",
    {
      "type": "code",
      "language": "typescript",
      "code": "interface RegisterModel {\n  name: string;\n  email: string;\n  password: string;\n}"
    },
    "Then the form data exists as signal state:",
    {
      "type": "code",
      "language": "typescript",
      "code": "registerModel = signal<RegisterModel>({\n  name: '',\n  email: '',\n  password: ''\n});"
    },
    "The model is easy to understand.",
    "No UI concerns.",
    "No validation messages.",
    "Just application data.",
    "Then I build the form around it:",
    {
      "type": "code",
      "language": "typescript",
      "code": "registerForm = form(this.registerModel, path => {\n  required(path.name, {\n    message: 'Name is required'\n  });\n\n  required(path.email, {\n    message: 'Email is required'\n  });\n\n  email(path.email, {\n    message: 'Enter a valid email address'\n  });\n\n  required(path.password, {\n    message: 'Password is required'\n  });\n\n  minLength(path.password, 8, {\n    message: 'Password must contain at least 8 characters'\n  });\n});"
    },
    "Now validation belongs to the form schema while the model remains clean.",
    "The template can bind directly to the field:",
    {
      "type": "code",
      "language": "html",
      "code": "<label for=\"email\">\n  Email\n</label>\n\n<input\n  id=\"email\"\n  type=\"email\"\n  [formField]=\"registerForm.email\"\n/>\n\n@if (\n  registerForm.email().touched() &&\n  registerForm.email().invalid()\n) {\n  <div\n    class=\"error\"\n    role=\"alert\"\n  >\n    @for (\n      error of registerForm.email().errors();\n      track error.kind\n    ) {\n      <p>{{ error.message }}</p>\n    }\n  </div>\n}"
    },
    "The architecture becomes:",
    {
      "type": "code",
      "language": "text",
      "code": "Model\n  ↓\nSignal\n  ↓\nSignal Form\n  ↓\nValidation\n  ↓\nField State\n  ↓\nUI"
    },
    "That feels natural in an application already designed around Signals.",
    {
      "type": "subheading",
      "text": "Reusable Signal Form Controls"
    },
    "This becomes even more interesting when building a reusable design system.",
    "Instead of repeating labels, validation rendering, and accessibility logic everywhere, I can build something like:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-form-input\n  label=\"Email\"\n  type=\"email\"\n  [field]=\"registerForm.email\"\n/>"
    },
    "The reusable component can handle:",
    {
      "type": "list",
      "items": [
        "label rendering",
        "error presentation",
        "required indicators",
        "accessibility attributes",
        "consistent spacing",
        "input styling"
      ]
    },
    "The parent form still owns:",
    {
      "type": "list",
      "items": [
        "the data model",
        "validation rules",
        "business logic",
        "submission behavior"
      ]
    },
    "That separation is important.",
    "A reusable form component shouldn't need to understand the entire business form.",
    "It should understand how to present a field correctly.",
    {
      "type": "subheading",
      "text": "Would I Migrate Every Reactive Form?"
    },
    "No.",
    "A mature production application with stable Reactive Forms doesn't automatically need a rewrite.",
    "I prefer Signal Forms when their model fits the architecture I'm building, particularly for new signal-first functionality.",
    "My rule is simple:",
    {
      "type": "aside",
      "text": "Modernization should solve a problem, not create a migration project for its own sake."
    },
    {
      "type": "heading",
      "text": "7. Signal Inputs and Reactive Component State"
    },
    "Component inputs are another place where Angular's reactive model becomes useful.",
    "Instead of treating an input as a property that happens to change, I can model it as reactive state:",
    {
      "type": "code",
      "language": "typescript",
      "code": "user = input.required<User>();\n\ndisplayName = computed(() => {\n  const user = this.user();\n\n  return `${user.firstName} ${user.lastName}`;\n});"
    },
    "The dependency is clear:",
    {
      "type": "code",
      "language": "typescript",
      "code": "Parent\n  ↓\ninput()\n  ↓\ncomputed()\n  ↓\nTemplate"
    },
    "If the input changes, the derived value follows that relationship.",
    "I don't need to manually synchronize another property.",
    "This is the same principle we saw earlier with computed():",
    {
      "type": "aside",
      "text": "Describe relationships instead of manually coordinating updates."
    },
    "That principle scales surprisingly well.",
    {
      "type": "subheading",
      "text": "A Useful Component Pattern"
    },
    "For reusable components, I try to keep the relationship simple:",
    {
      "type": "code",
      "language": "text",
      "code": "Input\n  ↓\nDerived State\n  ↓\nPresentation"
    },
    "Business logic shouldn't leak into every reusable UI component.",
    {
      "type": "heading",
      "text": "8. Angular Signals and RxJS Together"
    },
    "Whenever Signals are discussed, one question appears quickly:",
    {
      "type": "aside",
      "text": "Signals or RxJS?"
    },
    "I don't think that's the most useful question.",
    "They're good at different things.",
    "Imagine I'm building a search experience.",
    "The search text may naturally exist as UI state.",
    "But network behavior can involve:",
    {
      "type": "code",
      "language": "text",
      "code": "User Input\n    ↓\nDebounce\n    ↓\nCancel Previous Request\n    ↓\nLatest HTTP Request\n    ↓\nResponse\n    ↓\nUpdate UI"
    },
    "That's a stream problem.",
    "RxJS is excellent at it.",
    "For example, the application may need:",
    {
      "type": "list",
      "items": [
        "debounceTime",
        "distinctUntilChanged",
        "switchMap",
        "cancellation",
        "error handling",
        "stream composition"
      ]
    },
    "Trying to eliminate RxJS from this problem simply because Signals exist doesn't automatically make the implementation better.",
    "My mental model is:",
    {
      "type": "code",
      "language": "typescript",
      "code": "LOCAL UI STATE\n      ↓\n   Signals\n\n\nDERIVED STATE\n      ↓\n   computed()\n\n\nEVENTS / ASYNC STREAMS\n      ↓\n      RxJS\n\n\nSERVER COMMUNICATION\n      ↓\n HTTP / async data layer"
    },
    "Then these tools can meet at sensible boundaries.",
    "For example:",
    {
      "type": "code",
      "language": "typescript",
      "code": "Search Input\n    ↓\nSignal\n    ↓\nRxJS Search Pipeline\n    ↓\nHTTP\n    ↓\nResult State\n    ↓\ncomputed()\n    ↓\nUI"
    },
    {
      "type": "image",
      "src": "/media/insights/stopped-writing-angular-old-way-10-modern-patterns/signals-computed-rxjs.webp",
      "alt": "Signals and computed values update dependent UI, with RxJS handling asynchronous search requests.",
      "width": 1586,
      "height": 992
    },
    "The goal isn't:",
    {
      "type": "aside",
      "text": "Signals replace RxJS."
    },
    "The goal is:",
    {
      "type": "aside",
      "text": "Use each abstraction where it communicates the problem most clearly."
    },
    "This approach also helps when thinking about duplicate API requests and shared data flows in larger Angular applications.",
    {
      "type": "subheading",
      "text": "Related Reading"
    },
    "→ Angular Signals for State Management → RxJS: Reducing Duplicate API Calls",
    {
      "type": "heading",
      "text": "9. Angular @defer: Sometimes the Fastest Code Is Code We Haven't Loaded Yet"
    },
    "Performance discussions often focus on:",
    {
      "type": "list",
      "items": [
        "reducing execution time",
        "optimizing loops",
        "reducing unnecessary rendering",
        "caching",
        "bundle size"
      ]
    },
    "Those things matter.",
    "But another question can be even more valuable:",
    {
      "type": "aside",
      "text": "Does the user actually need this UI right now?"
    },
    "Imagine a product page containing:",
    {
      "type": "code",
      "language": "text",
      "code": "Product Information\nReviews\nRecommendations\nAnalytics Widget\nRelated Products\nSecondary Content"
    },
    "The user probably needs the product information immediately.",
    "They probably don't need every review and recommendation before the first useful screen appears.",
    "That's where @defer becomes interesting.",
    {
      "type": "code",
      "language": "html",
      "code": "<app-product-details />\n\n@defer (on viewport) {\n  <app-reviews />\n} @placeholder {\n  <app-review-skeleton />\n}\n\n@defer (on idle) {\n  <app-recommendations />\n}"
    },
    "Now the rendering strategy reflects user priority:",
    {
      "type": "code",
      "language": "text",
      "code": "INITIAL\n\nCritical Content\n      ↓\n Render Now\n\n\nSECONDARY\n\nReviews\nRecommendations\nOther Widgets\n      ↓\n    Defer\n      ↓\nLoad When Needed"
    },
    "This changes the performance question.",
    "Instead of only asking:",
    {
      "type": "aside",
      "text": "How can I make this component faster?"
    },
    "I also ask:",
    {
      "type": "aside",
      "text": "When does this component actually need to exist?"
    },
    "That's an architectural performance decision, not just a micro-optimization.",
    {
      "type": "subheading",
      "text": "My Rule for @defer"
    },
    "Don't defer something simply because you can.",
    "Ask:",
    {
      "type": "list",
      "items": [
        "Is it required for the first useful screen?",
        "Is it below the fold?",
        "Can the user interact without it?",
        "Can a meaningful placeholder be shown?",
        "Does delaying it improve the initial experience?"
      ],
      "ordered": true
    },
    "Performance is often about timing, not just speed.",
    {
      "type": "heading",
      "text": "10. Designing Angular Applications for Zoneless Change Detection"
    },
    "Zone.js has historically played an important role in Angular change detection.",
    "Modern Angular's reactive APIs allow us to be increasingly explicit about what changed.",
    "Consider:",
    {
      "type": "code",
      "language": "typescript",
      "code": "count = signal(0);\n\nincrement() {\n  this.count.update(value => value + 1);\n}"
    },
    "The signal itself communicates that state has changed.",
    "Conceptually, we're moving away from thinking only in terms of:",
    {
      "type": "code",
      "language": "text",
      "code": "Something happened\n       ↓\nCheck broadly for changes\n       ↓\nFind what needs updating"
    },
    "toward a more explicit reactive model:",
    {
      "type": "code",
      "language": "text",
      "code": "State changed\n      ↓\nKnown dependency reacts\n      ↓\nRelevant UI updates"
    },
    "This is why I think Signals and zoneless Angular are particularly interesting together.",
    "It's not simply about removing Zone.js.",
    "It's about designing applications where reactive dependencies are easier to understand.",
    "That can contribute to a more predictable mental model for application state and rendering.",
    {
      "type": "subheading",
      "text": "Designing for Explicit Reactivity"
    },
    "When building with this mindset, I pay more attention to:",
    {
      "type": "list",
      "items": [
        "clear state ownership",
        "explicit reactive dependencies",
        "derived state",
        "focused components",
        "predictable data flow",
        "avoiding unnecessary synchronization"
      ]
    },
    "Zoneless thinking is therefore more than a configuration decision.",
    "It can influence how the application is architected.",
    {
      "type": "image",
      "src": "/media/insights/stopped-writing-angular-old-way-10-modern-patterns/zoneless-deferred-performance.webp",
      "alt": "Angular performance using critical initial content, deferred secondary content and zoneless signal updates.",
      "width": 1586,
      "height": 992
    },
    {
      "type": "heading",
      "text": "What Actually Changed in My Angular Code?"
    },
    "Looking at all these APIs separately can make modern Angular seem like a collection of syntax changes.",
    "I don't think that's the important part.",
    "The bigger change is architectural.",
    {
      "type": "subheading",
      "text": "My Older Mental Model"
    },
    {
      "type": "code",
      "language": "text",
      "code": "Component\n ├── State\n ├── Subscriptions\n ├── Form Setup\n ├── Derived Values\n ├── Change Coordination\n ├── API Logic\n └── Template Logic"
    },
    "One component could slowly become responsible for everything.",
    {
      "type": "subheading",
      "text": "My Preferred Direction Today"
    },
    {
      "type": "code",
      "language": "text",
      "code": "Source State\n     ↓\nSignals / Streams\n     ↓\nDerived State\n     ↓\nFocused Feature Logic\n     ↓\nFocused Components\n     ↓\nUI"
    },
    "The responsibilities become easier to explain.",
    "Signals manage reactive state.",
    "computed() describes derived state.",
    "RxJS handles asynchronous streams and event composition.",
    "Signal Forms model signal-first form state.",
    "Standalone APIs make dependencies clearer.",
    "Built-in control flow simplifies templates.",
    "@defer controls when non-critical UI work happens.",
    "Zoneless patterns encourage more explicit reactive dependencies.",
    "This is the part of modern Angular I find most valuable.",
    "Not shorter syntax.",
    "Clearer responsibility.",
    {
      "type": "heading",
      "text": "What I Don't Do"
    },
    "Using modern Angular doesn't mean replacing everything with the newest API.",
    "I don't:",
    {
      "type": "list",
      "items": [
        "replace RxJS with Signals when the problem is genuinely a stream",
        "migrate stable Reactive Forms simply because Signal Forms exist",
        "create dozens of tiny components simply so the architecture looks \"modular\"",
        "use effect() where computed() can represent the relationship",
        "defer UI that users actually need immediately",
        "adopt an API simply because it's new"
      ]
    },
    "Because:",
    {
      "type": "aside",
      "text": "New syntax doesn't automatically create good architecture."
    },
    "Clear boundaries do.",
    "Good state ownership does.",
    "Predictable data flow does.",
    "Maintainability does.",
    {
      "type": "heading",
      "text": "My Modern Angular Decision Guide"
    },
    "When I'm deciding which Angular tool to use, this is the mental model I currently follow:",
    {
      "type": "code",
      "language": "text",
      "code": "Is it synchronous application state?\n        ↓\n      Signal\n\n\nCan it be calculated from existing state?\n        ↓\n    computed()\n\n\nIs it an asynchronous stream or event sequence?\n        ↓\n      RxJS\n\n\nIs it a signal-first form?\n        ↓\n   Signal Forms\n\n\nIs the component non-critical initially?\n        ↓\n     @defer\n\n\nCan the feature own its dependencies directly?\n        ↓\nStandalone Architecture\n\n\nDo I need explicit reactive rendering?\n        ↓\nSignals + Zoneless"
    },
    "This isn't a rulebook.",
    "It's a way to avoid reaching for the same abstraction for every problem.",
    {
      "type": "heading",
      "text": "From Modern Angular Features to Production Architecture"
    },
    "The real challenge isn't learning what signal(), @defer, inject() or Signal Forms do.",
    "Documentation can teach us the syntax.",
    "The harder questions are:",
    "Where should state live?",
    "Which values should be derived?",
    "When should RxJS own the flow?",
    "What should become reusable?",
    "Where should API data be shared?",
    "Which UI should be loaded immediately?",
    "What belongs to a feature versus the shared layer?",
    "How do we make all of this understandable to the next developer?",
    "Those decisions determine whether an Angular application remains maintainable as it grows.",
    "That's why I don't think of these as simply \"10 Angular features.\"",
    "I think of them as tools for building a clearer frontend architecture.",
    {
      "type": "heading",
      "text": "A Practical Modern Angular Architecture"
    },
    "Putting everything together, a production-oriented feature can look conceptually like this:",
    {
      "type": "code",
      "language": "typescript",
      "code": "                    FEATURE\n                       │\n        ┌──────────────┼──────────────┐\n        │              │              │\n      State          Data           UI\n        │              │              │\n    Signals          RxJS        Components\n        │              │              │\n   computed()         HTTP        Inputs\n        │              │              │\n        └──────────────┼──────────────┘\n                       │\n                  Feature Page\n                       │\n                       ▼\n                       UI"
    },
    "And at the application level:",
    {
      "type": "code",
      "language": "text",
      "code": "src/\n└── app/\n    ├── core/\n    │   ├── auth/\n    │   ├── http/\n    │   └── routing/\n    │\n    ├── features/\n    │   ├── users/\n    │   ├── dashboard/\n    │   ├── products/\n    │   └── settings/\n    │\n    ├── shared/\n    │   ├── ui/\n    │   ├── forms/\n    │   └── utilities/\n    │\n    └── app.config.ts"
    },
    "The exact architecture will vary by application.",
    "The important thing is that responsibilities remain understandable.",
    {
      "type": "heading",
      "text": "Modern Angular Checklist"
    },
    "Before I consider an Angular feature complete, I like asking:",
    {
      "type": "subheading",
      "text": "State"
    },
    {
      "type": "list",
      "items": [
        "Is the source of truth obvious?",
        "Am I storing derived state unnecessarily?",
        "Should this state be a Signal?"
      ]
    },
    {
      "type": "subheading",
      "text": "Async"
    },
    {
      "type": "list",
      "items": [
        "Is this genuinely a stream?",
        "Do I need RxJS operators such as switchMap or debounceTime?",
        "Am I creating duplicate requests?"
      ]
    },
    {
      "type": "subheading",
      "text": "Components"
    },
    {
      "type": "list",
      "items": [
        "Does this component have a clear responsibility?",
        "Are its dependencies obvious?",
        "Could it own its dependencies directly?"
      ]
    },
    {
      "type": "subheading",
      "text": "Forms"
    },
    {
      "type": "list",
      "items": [
        "Is the form model separate from presentation?",
        "Are validation rules easy to understand?",
        "Can reusable field components handle presentation consistently?"
      ]
    },
    {
      "type": "subheading",
      "text": "Performance"
    },
    {
      "type": "list",
      "items": [
        "Does this UI need to load immediately?",
        "Could @defer be appropriate?",
        "Am I optimizing something users actually experience?"
      ]
    },
    {
      "type": "subheading",
      "text": "Architecture"
    },
    {
      "type": "list",
      "items": [
        "Does the feature own its state?",
        "Is shared/ becoming a dumping ground?",
        "Can another developer understand the data flow quickly?"
      ]
    },
    {
      "type": "heading",
      "text": "Final Thought"
    },
    "Modern Angular isn't simply about learning new APIs.",
    "It's about making better decisions about:",
    "State. Dependencies. Data flow. Rendering. Performance. Component boundaries.",
    "Signals, computed(), RxJS, Signal Forms, standalone APIs, @defer, and zoneless patterns are tools.",
    "The real skill is knowing where each tool belongs.",
    {
      "type": "aside",
      "text": "Don't use modern Angular just to write modern Angular. Use it to build clearer applications."
    },
    "That's the difference between simply using modern Angular features and actually building modern Angular applications.",
    "I'm continuing to document the frontend architecture patterns, performance techniques, reusable UI approaches, and engineering decisions I use when building frontend applications.",
    {
      "type": "heading",
      "text": "Continue Exploring Angular"
    },
    "If you're exploring modern Angular architecture, these are the next topics I'd recommend reading:",
    {
      "type": "subheading",
      "text": "Angular Signals for State Management"
    },
    "How I think about reactive state, derived values, and state ownership.",
    "→ Read the article",
    {
      "type": "subheading",
      "text": "RxJS: Reducing Duplicate API Calls"
    },
    "How shared data flows can reduce unnecessary network requests.",
    "→ Read the article",
    {
      "type": "subheading",
      "text": "Angular Zoneless Change Detection"
    },
    "How explicit reactivity changes the way we think about rendering.",
    "→ Read the article",
    {
      "type": "subheading",
      "text": "Accessible Angular Forms"
    },
    "Building reusable form experiences without sacrificing accessibility.",
    "→ Read the article",
    {
      "type": "subheading",
      "text": "Angular Performance Checklist"
    },
    "The areas I review when improving production frontend performance.",
    "→ Read the article",
    {
      "type": "subheading",
      "text": "Angular Codebase Audit"
    },
    "What I look for when reviewing architecture and maintainability.",
    "→ Read the article",
    {
      "type": "heading",
      "text": "Building or Improving an Angular Application?"
    },
    "I work on frontend applications with a focus on:",
    "Angular Architecture · Signals · RxJS · Performance · Reusable UI · Accessibility · TypeScript",
    "If you're interested in how these ideas translate into real product interfaces, explore my Angular case studies, frontend architecture work, and engineering insights.",
    {
      "type": "subheading",
      "text": "Explore My Work"
    },
    {
      "type": "link",
      "text": "→ rabinr.in",
      "href": "/"
    },
    {
      "type": "heading",
      "text": "Let's Discuss"
    },
    "What modern Angular feature has changed the way you build applications the most?",
    "Signals?",
    "Signal Forms?",
    "Built-in control flow?",
    "@defer?",
    "Zoneless Angular?",
    "Or are you still finding Reactive Forms + RxJS the better fit for your applications?",
    "I'd be interested to hear how other Angular developers are approaching the shift.",
    {
      "type": "heading",
      "text": "Frequently Asked Questions"
    },
    {
      "type": "subheading",
      "text": "Is Angular Signals replacing RxJS?"
    },
    "Not necessarily.",
    "Signals and RxJS solve different problems. Signals are particularly useful for reactive application state and derived state, while RxJS remains valuable for asynchronous streams, event composition, cancellation, and stream transformations.",
    {
      "type": "subheading",
      "text": "Should I migrate my existing Angular application to Signals?"
    },
    "Not automatically.",
    "If the existing architecture is stable and solving the problem effectively, a complete rewrite may create unnecessary risk. Modern APIs can be introduced where they provide a clear benefit.",
    {
      "type": "subheading",
      "text": "Are Standalone Components better than NgModules?"
    },
    "Standalone APIs provide a different way to organize dependencies and features. The important architectural goal is clear ownership and understandable dependencies rather than changing syntax simply for the sake of modernization.",
    {
      "type": "subheading",
      "text": "Should I use Signal Forms for every Angular form?"
    },
    "No.",
    "Signal Forms can fit naturally into signal-first applications, particularly for new functionality. Existing Reactive Forms don't automatically need to be migrated.",
    {
      "type": "subheading",
      "text": "Should every Angular application use zoneless change detection?"
    },
    "The decision depends on the application and its architecture.",
    "The more important principle is understanding and designing explicit reactive dependencies rather than adopting a configuration simply because it is newer.",
    {
      "type": "subheading",
      "text": "When should I use @defer?"
    },
    "Consider @defer for UI that isn't required for the initial useful experience, such as secondary content or below-the-fold functionality.",
    "Don't defer content that users need immediately.",
    {
      "type": "heading",
      "text": "Key Takeaways"
    },
    {
      "type": "code",
      "language": "html",
      "code": "1. Use Signals for clear reactive state.\n\n2. Use computed() for derived state.\n\n3. Use inject() when it improves dependency clarity.\n\n4. Prefer clear feature ownership with standalone architecture.\n\n5. Use built-in control flow for readable templates.\n\n6. Consider Signal Forms for signal-first form experiences.\n\n7. Treat inputs as reactive state when appropriate.\n\n8. Use Signals and RxJS together rather than treating them as competitors.\n\n9. Use @defer to control when non-critical work happens.\n\n10. Design for explicit reactive dependencies."
    },
    "And above everything:",
    {
      "type": "aside",
      "text": "Choose the simplest abstraction that clearly communicates the problem."
    },
    {
      "type": "heading",
      "text": "About This Article"
    },
    "This article is part of my ongoing collection of frontend engineering insights covering:",
    "Angular · TypeScript · Frontend Architecture · Performance · RxJS · Signals · Reusable UI · Accessibility",
    {
      "type": "link",
      "text": "More engineering insights and case studies → rabinr.in",
      "href": "/"
    },
    {
      "type": "subheading",
      "text": "Tags"
    },
    "#Angular #AngularDeveloper #AngularSignals #FrontendArchitecture #TypeScript #RxJS #SignalForms #WebPerformance #ZonelessAngular #FrontendDevelopment"
  ]
};
