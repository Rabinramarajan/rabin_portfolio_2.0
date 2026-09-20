import type { Insight } from "@/content/types";

export const angularSignalFormsCustomControls: Insight = {
  "id": "angular-signal-forms-custom-controls",
  "number": "13",
  "title": "Angular Signal Forms: Building Custom Controls the Modern Way",
  "topic": "Architecture",
  "datePublished": "2026-09-19",
  "seoTitle": "Angular Signal Forms: Build Custom Controls",
  "seoDescription": "Build reusable Angular Signal Form controls with FormValueControl, FormCheckboxControl, schema validation, blur handling and accessible interactions.",
  "dek": "Connect custom inputs, toggles, phone fields and rating controls to Angular Signal Forms with reusable validation schemas and clear ownership of form state.",
  "cover": {
    "src": "/media/insights/angular-signal-forms-custom-controls/cover.webp",
    "alt": "Angular-inspired shield connected to an input, toggle, calendar and rating control by signal lines.",
    "width": 1536,
    "height": 1024
  },
  "pullQuote": "Let the custom control own the UI. Let the form schema own the rules. Let Signals connect the two.",
  "takeaways": [
    "Expose value for value controls and checked for checkbox controls.",
    "Keep business validation in reusable form schemas.",
    "Emit touch on blur and forward disabled and readonly state.",
    "Support keyboard access, labels and error feedback."
  ],
  "related": [
    {
      "label": "10 Modern Angular Patterns",
      "href": "/insights/stopped-writing-angular-old-way-10-modern-patterns"
    },
    {
      "label": "Accessible Angular Forms",
      "href": "/insights/accessible-angular-forms"
    }
  ],
  "body": [
    "Modern Angular forms are moving toward a more reactive and type-safe model.",
    "With Signal Forms, we can build forms around Angular Signals, define validation through schemas, and connect custom UI components directly to form state.",
    "But the interesting part is this:",
    "What happens when a native <input> is not enough?",
    "Maybe your application needs:",
    {
      "type": "list",
      "items": [
        "A custom date picker",
        "Phone number input",
        "Currency input",
        "OTP component",
        "Searchable select",
        "Tag selector",
        "Rich text editor",
        "Custom toggle",
        "File uploader",
        "Rating component"
      ]
    },
    "This is where Custom Signal Form Controls become extremely useful.",
    {
      "type": "heading",
      "text": "What are Angular Signal Forms?"
    },
    "Signal Forms provide a signal-based approach to managing form state.",
    "Instead of creating multiple FormControl and FormGroup instances, we start with a writable signal representing our form model.",
    {
      "type": "code",
      "language": "ts",
      "code": "import { signal } from '@angular/core';\nimport { form } from '@angular/forms/signals';\n\ninterface LoginModel {\n  email: string;\n  password: string;\n}\n\nloginModel = signal<LoginModel>({\n  email: '',\n  password: '',\n});\n\nloginForm = form(this.loginModel);"
    },
    "The form automatically creates a field tree that mirrors the model.",
    {
      "type": "code",
      "language": "ts",
      "code": "loginForm.email\nloginForm.password"
    },
    "The field state exposes signals such as:",
    {
      "type": "code",
      "language": "ts",
      "code": "loginForm.email().value()\nloginForm.email().valid()\nloginForm.email().invalid()\nloginForm.email().touched()\nloginForm.email().dirty()\nloginForm.email().errors()"
    },
    "This gives us a reactive foundation for form state.",
    "Signal Forms were introduced in Angular 21 through @angular/forms/signals. Check the APIs supported by your installed Angular version; these examples follow the current documentation.",
    {
      "type": "heading",
      "text": "Why Custom Controls?"
    },
    "Native controls already work:",
    {
      "type": "code",
      "language": "html",
      "code": "<input [formField]=\"loginForm.email\" />"
    },
    "But real applications often need custom UI.",
    "For example:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-phone-input />"
    },
    "or:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-date-picker />"
    },
    "or:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-search-select />"
    },
    "The challenge is making these components behave like normal form controls.",
    "We want:",
    {
      "type": "code",
      "language": "text",
      "code": "Form Model\n    ↓\nField Tree\n    ↓\nCustom Control\n    ↓\nUser Interaction\n    ↓\nUpdated Signal\n    ↓\nForm State"
    },
    "Signal Forms provides dedicated interfaces for this.",
    {
      "type": "heading",
      "text": "The Two Main Custom Control Interfaces"
    },
    "Signal Forms provides two important interfaces:",
    {
      "type": "subheading",
      "text": "FormValueControl<T>"
    },
    "Use this for controls that represent a single value.",
    "Examples:",
    {
      "type": "list",
      "items": [
        "Text input",
        "Number input",
        "Date picker",
        "Select",
        "Currency input",
        "Phone input",
        "Rating"
      ]
    },
    "The control exposes:",
    {
      "type": "code",
      "language": "ts",
      "code": "value = model.required<T>();"
    },
    {
      "type": "subheading",
      "text": "FormCheckboxControl"
    },
    "Use this for boolean controls.",
    "Examples:",
    {
      "type": "list",
      "items": [
        "Checkbox",
        "Toggle",
        "Switch"
      ]
    },
    "The control exposes:",
    {
      "type": "code",
      "language": "ts",
      "code": "checked = model(false);"
    },
    "Angular's [formField] directive detects these interfaces and connects the control to the field tree automatically.",
    {
      "type": "heading",
      "text": "Building Our First Custom Control"
    },
    "Let's create a reusable custom input.",
    {
      "type": "code",
      "language": "ts",
      "code": "import { Component, model } from '@angular/core';\nimport { FormValueControl } from '@angular/forms/signals';\n\n@Component({\n  selector: 'app-custom-input',\n  standalone: true,\n  template: `\n    <input\n      type=\"text\"\n      [value]=\"value()\"\n      (input)=\"onInput($event)\"\n    />\n  `\n})\nexport class CustomInput implements FormValueControl<string> {\n\n  value = model('');\n\n  onInput(event: Event) {\n    const input = event.target as HTMLInputElement;\n\n    this.value.set(input.value);\n  }\n}"
    },
    "The important part is:",
    {
      "type": "code",
      "language": "ts",
      "code": "implements FormValueControl<string>"
    },
    "and:",
    {
      "type": "code",
      "language": "ts",
      "code": "value = model('');"
    },
    "The value model signal becomes the bridge between our custom component and Signal Forms.",
    {
      "type": "heading",
      "text": "Connecting the Custom Control"
    },
    "Now we can connect it using [formField].",
    {
      "type": "code",
      "language": "ts",
      "code": "import { Component, signal } from '@angular/core';\nimport { form, FormField } from '@angular/forms/signals';\nimport { CustomInput } from './custom-input';\n\n@Component({\n  imports: [\n    FormField,\n    CustomInput\n  ],\n  template: `\n    <app-custom-input\n      [formField]=\"registrationForm.email\"\n    />\n  `\n})\nexport class RegistrationComponent {\n\n  registrationModel = signal({\n    email: ''\n  });\n\n  registrationForm = form(this.registrationModel);\n}"
    },
    "That's the important architectural difference.",
    "We don't manually create a FormControl.",
    "We don't manually subscribe to valueChanges.",
    "We don't need a custom ControlValueAccessor.",
    "The Signal Forms field system connects the component to the form.",
    {
      "type": "heading",
      "text": "Custom Checkbox / Toggle"
    },
    "For boolean controls, use:",
    {
      "type": "code",
      "language": "ts",
      "code": "FormCheckboxControl"
    },
    "Example:",
    {
      "type": "code",
      "language": "ts",
      "code": "import {\n  Component,\n  input,\n  model,\n  output\n} from '@angular/core';\n\nimport {\n  FormCheckboxControl\n} from '@angular/forms/signals';\n\n@Component({\n  selector: 'app-toggle',\n  standalone: true,\n  template: `\n    <button\n      type=\"button\"\n      [class.active]=\"checked()\"\n      role=\"switch\"\n      aria-label=\"Notifications\"\n      [attr.aria-checked]=\"checked()\"\n      [disabled]=\"disabled()\"\n      [attr.aria-readonly]=\"readonly()\"\n      (blur)=\"touch.emit()\"\n      (click)=\"toggle()\"\n    >\n      {{ checked() ? 'ON' : 'OFF' }}\n    </button>\n  `\n})\nexport class ToggleComponent\n  implements FormCheckboxControl {\n\n  checked = model(false);\n  disabled = input(false);\n  readonly = input(false);\n  touch = output<void>();\n\n  toggle() {\n    if (this.disabled() || this.readonly()) return;\n    this.checked.update(value => !value);\n  }\n}"
    },
    "Then:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-toggle\n  [formField]=\"settingsForm.notifications\"\n/>"
    },
    "The important distinction is:",
    {
      "type": "code",
      "language": "text",
      "code": "FormValueControl\n      ↓\nvalue\n\nFormCheckboxControl\n      ↓\nchecked"
    },
    "A FormValueControl should not expose checked, and a FormCheckboxControl should not expose value.",
    {
      "type": "heading",
      "text": "Custom Control + Validation"
    },
    "Validation belongs in the form schema.",
    "For example:",
    {
      "type": "code",
      "language": "ts",
      "code": "import {\n  form,\n  required,\n  email\n} from '@angular/forms/signals';\n\nregistrationForm = form(\n  this.registrationModel,\n  path => {\n\n    required(path.email);\n\n    email(path.email);\n\n  }\n);"
    },
    "Then:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-custom-input\n  [formField]=\"registrationForm.email\"\n/>"
    },
    "This separation is important.",
    {
      "type": "subheading",
      "text": "Avoid"
    },
    "Putting business validation inside the custom component:",
    {
      "type": "code",
      "language": "ts",
      "code": "isValid() {\n  return this.value().length > 5;\n}"
    },
    {
      "type": "subheading",
      "text": "Prefer"
    },
    "Keeping validation inside the form schema:",
    {
      "type": "code",
      "language": "ts",
      "code": "required(path.email);\n\nemail(path.email);"
    },
    "The custom control should primarily focus on UI + interaction.",
    "The form schema should own validation + business rules.",
    "This separation makes components more reusable.",
    {
      "type": "heading",
      "text": "Reading Validation State Inside a Custom Control"
    },
    "Signal Forms can provide state information to custom controls.",
    "Useful state includes:",
    {
      "type": "code",
      "language": "text",
      "code": "disabled\nreadonly\nhidden\ninvalid\nerrors\ntouched\ndirty"
    },
    "For example, your UI can react to:",
    {
      "type": "code",
      "language": "ts",
      "code": "invalid()"
    },
    "and display an error state.",
    "Conceptually:",
    {
      "type": "code",
      "language": "text",
      "code": "Form Schema\n     ↓\nValidation\n     ↓\nField State\n     ↓\nCustom Control\n     ↓\nUI Feedback"
    },
    "This keeps the form state reactive instead of manually synchronizing it.",
    {
      "type": "heading",
      "text": "Handling Touched State"
    },
    "One important detail is blur handling.",
    "For a custom control:",
    {
      "type": "code",
      "language": "ts",
      "code": "touch = output<void>();"
    },
    "Then:",
    {
      "type": "code",
      "language": "html",
      "code": "<input\n  [value]=\"value()\"\n  (input)=\"onInput($event)\"\n  (blur)=\"touch.emit()\"\n/>"
    },
    "Why?",
    "Because the form system needs to know when the user has left the control.",
    "This becomes especially important when using rules such as:",
    {
      "type": "code",
      "language": "ts",
      "code": "debounce(path.email, 'blur');"
    },
    "Without a proper touch/blur event, blur-based behavior won't work correctly.",
    {
      "type": "heading",
      "text": "Reusable Custom Controls"
    },
    "Imagine we build:",
    {
      "type": "code",
      "language": "text",
      "code": "UI Library\n│\n├── custom-input\n├── phone-input\n├── currency-input\n├── date-picker\n├── select\n├── toggle\n├── rating\n└── tag-input"
    },
    "Each component should have one responsibility.",
    "For example:",
    {
      "type": "code",
      "language": "text",
      "code": "PhoneInputComponent\n        │\n        ├── UI\n        ├── Formatting\n        ├── User interaction\n        └── FormValueControl<string>"
    },
    "Then the application owns:",
    {
      "type": "code",
      "language": "text",
      "code": "Validation\nBusiness Rules\nAPI Integration\nSubmission"
    },
    "This creates a cleaner architecture.",
    {
      "type": "heading",
      "text": "Companion Validation Schemas"
    },
    "A reusable control may also have common validation requirements.",
    "For example, an email control might always require:",
    {
      "type": "code",
      "language": "text",
      "code": "required\nemail format"
    },
    "Instead of repeating these rules everywhere, create a reusable schema.",
    {
      "type": "code",
      "language": "ts",
      "code": "import {\n  schema,\n  required,\n  email\n} from '@angular/forms/signals';\n\nexport const emailFieldSchema = schema<string>(path => {\n\n  required(path, {\n    message: 'Email is required'\n  });\n\n  email(path, {\n    message: 'Enter a valid email address'\n  });\n\n});"
    },
    "Then apply it:",
    {
      "type": "code",
      "language": "ts",
      "code": "import {\n  form,\n  apply\n} from '@angular/forms/signals';\n\nregistrationForm = form(\n  this.registrationModel,\n  path => {\n\n    apply(\n      path.email,\n      emailFieldSchema\n    );\n\n  }\n);"
    },
    "This allows the custom control and its validation rules to become a reusable package.",
    "Angular's documentation specifically recommends this companion-schema approach for reusable controls.",
    {
      "type": "heading",
      "text": "Real-World Example: Phone Input"
    },
    "A phone input is a good example of a custom control.",
    {
      "type": "code",
      "language": "ts",
      "code": "import { Component, model, output } from '@angular/core';\nimport { FormValueControl } from '@angular/forms/signals';\n\n@Component({\n  selector: 'app-phone-input',\n  standalone: true,\n  template: `\n    <input\n      type=\"tel\"\n      [value]=\"value()\"\n      (input)=\"onInput($event)\"\n      (blur)=\"touch.emit()\"\n    />\n  `\n})\nexport class PhoneInput\n  implements FormValueControl<string> {\n\n  value = model('');\n\n  touch = output<void>();\n\n  onInput(event: Event) {\n\n    const input =\n      event.target as HTMLInputElement;\n\n    const formatted =\n      input.value.replace(/\\D/g, '');\n\n    input.value = formatted;\n    this.value.set(formatted);\n  }\n}"
    },
    "Now the component can be used like a normal Signal Form field:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-phone-input\n  [formField]=\"profileForm.phone\"\n/>"
    },
    "This digits-only demonstration is not international phone validation. Production controls need country-code and extension handling, caret preservation, labels and disabled state. Writing the normalized text back to the input also handles edits that leave the model unchanged.",
    {
      "type": "heading",
      "text": "Real-World Example: Custom Rating Control"
    },
    "Imagine a rating component:",
    {
      "type": "code",
      "language": "html",
      "code": "<app-rating\n  [formField]=\"reviewForm.rating\"\n/>"
    },
    "The model:",
    {
      "type": "code",
      "language": "ts",
      "code": "reviewModel = signal({\n  rating: 0\n});"
    },
    "The component:",
    {
      "type": "code",
      "language": "ts",
      "code": "export class RatingComponent\n  implements FormValueControl<number> {\n\n  value = model(0);\n\n  setRating(rating: number) {\n    this.value.set(rating);\n  }\n}"
    },
    "Template:",
    {
      "type": "code",
      "language": "html",
      "code": "<button\n  type=\"button\"\n  (click)=\"setRating(1)\"\n>\n  ★\n</button>\n\n<button\n  type=\"button\"\n  (click)=\"setRating(2)\"\n>\n  ★\n</button>"
    },
    "The same pattern can be extended to:",
    {
      "type": "list",
      "items": [
        "Star rating",
        "Emoji rating",
        "Slider",
        "Color picker",
        "Range selector"
      ]
    },
    {
      "type": "heading",
      "text": "Signal Forms + Debouncing"
    },
    "Search components are another good use case.",
    "For example:",
    {
      "type": "code",
      "language": "ts",
      "code": "searchForm = form(\n  this.searchModel,\n  path => {\n    debounce(path.query, 'blur');\n  }\n);"
    },
    "More advanced form logic can also control:",
    {
      "type": "code",
      "language": "text",
      "code": "disabled()\nhidden()\nreadonly()\ndebounce()\nmetadata()"
    },
    "based on reactive conditions.",
    "This is useful for:",
    {
      "type": "code",
      "language": "text",
      "code": "Search fields\nAutocomplete\nCoupon validation\nDynamic forms\nConditional fields\nAPI-backed inputs"
    },
    {
      "type": "heading",
      "text": "Custom Controls vs ControlValueAccessor"
    },
    "If you've worked with Angular Reactive Forms, you probably know:",
    {
      "type": "code",
      "language": "ts",
      "code": "ControlValueAccessor"
    },
    "The traditional architecture looks like:",
    {
      "type": "code",
      "language": "text",
      "code": "FormControl\n      ↓\nControlValueAccessor\n      ↓\nCustom Component"
    },
    "With Signal Forms:",
    {
      "type": "code",
      "language": "text",
      "code": "FieldTree\n      ↓\nFormField\n      ↓\nFormValueControl\n      ↓\nCustom Component"
    },
    "For new Signal Form controls, Angular recommends the dedicated Signal Forms control interfaces rather than using ControlValueAccessor.",
    "ControlValueAccessor remains useful for compatibility with existing reactive-form components.",
    "Prefer one clear control contract. Check the interoperability support in your Angular version before adding a ControlValueAccessor adapter.",
    {
      "type": "heading",
      "text": "Recommended Architecture"
    },
    "For a large Angular application, I would structure reusable form controls like this:",
    {
      "type": "code",
      "language": "text",
      "code": "src/\n└── app/\n    └── shared/\n        └── form-controls/\n            ├── input/\n            │   ├── input.component.ts\n            │   ├── input.component.html\n            │   └── input.component.scss\n            │\n            ├── phone-input/\n            │   ├── phone-input.component.ts\n            │   └── phone-input.schema.ts\n            │\n            ├── date-picker/\n            │   ├── date-picker.component.ts\n            │   └── date-picker.schema.ts\n            │\n            ├── select/\n            ├── toggle/\n            ├── rating/\n            └── index.ts"
    },
    "For a component library:",
    {
      "type": "code",
      "language": "text",
      "code": "@company/angular-form-controls"
    },
    "could expose:",
    {
      "type": "code",
      "language": "ts",
      "code": "export {\n  PhoneInputComponent,\n  phoneFieldSchema\n};\n\nexport {\n  DatePickerComponent\n};\n\nexport {\n  RatingComponent\n};"
    },
    "This makes the controls portable across applications.",
    {
      "type": "heading",
      "text": "Best Practices"
    },
    {
      "type": "subheading",
      "text": "1. Keep the control focused"
    },
    "The component should manage:",
    {
      "type": "code",
      "language": "text",
      "code": "UI\nInteraction\nFormatting\nValue updates\nAccessibility"
    },
    {
      "type": "subheading",
      "text": "2. Keep validation in schemas"
    },
    "Use:",
    {
      "type": "code",
      "language": "ts",
      "code": "required()\nemail()\nminLength()\npattern()"
    },
    "instead of embedding business rules inside the component.",
    {
      "type": "subheading",
      "text": "3. Prefer Signals"
    },
    "Use:",
    {
      "type": "code",
      "language": "ts",
      "code": "model()\ninput()\noutput()\ncomputed()"
    },
    "where appropriate.",
    {
      "type": "subheading",
      "text": "4. Handle blur correctly"
    },
    "Custom controls should correctly communicate interaction state.",
    {
      "type": "subheading",
      "text": "5. Design for accessibility"
    },
    "A custom control should still support:",
    {
      "type": "code",
      "language": "text",
      "code": "Keyboard navigation\nFocus management\nLabels\nARIA\nDisabled state\nReadonly state\nError messaging"
    },
    {
      "type": "subheading",
      "text": "6. Avoid unnecessary effects"
    },
    "Don't create effects simply to synchronize form state manually.",
    "Let Signal Forms manage the state connection.",
    "Angular's documentation recommends using the form system's state flow rather than registering custom effects for state management.",
    {
      "type": "heading",
      "text": "One Important Mental Model"
    },
    "The easiest way to understand Signal Forms Custom Controls is:",
    {
      "type": "code",
      "language": "text",
      "code": "                 SIGNAL FORM\n                     │\n                     ▼\n                 FieldTree\n                     │\n                     ▼\n                 FormField\n                     │\n          ┌──────────┴──────────┐\n          ▼                     ▼\n   FormValueControl     FormCheckboxControl\n          │                     │\n          ▼                     ▼\n       value()              checked()\n          │                     │\n          └──────────┬──────────┘\n                     ▼\n                  UI"
    },
    "The custom component doesn't own the entire form.",
    "It owns its control UI and value interaction.",
    "The form owns:",
    {
      "type": "code",
      "language": "text",
      "code": "Validation\nState\nBusiness rules\nForm model\nSubmission"
    },
    "That separation is what makes the architecture scalable.",
    {
      "type": "heading",
      "text": "When Should You Use Custom Signal Form Controls?"
    },
    "Use them when your UI is more complex than native HTML controls.",
    "Good examples:",
    {
      "type": "code",
      "language": "text",
      "code": "✓ Date picker\n✓ Phone input\n✓ Currency input\n✓ Searchable select\n✓ OTP input\n✓ Rating\n✓ Tag selector\n✓ Rich text editor\n✓ Custom toggle\n✓ File picker"
    },
    "For a simple:",
    {
      "type": "code",
      "language": "html",
      "code": "<input>\n<select>\n<textarea>"
    },
    "there is usually no reason to create a custom control.",
    "Use the simplest control that solves the problem.",
    {
      "type": "heading",
      "text": "Final Takeaway"
    },
    "Angular Signal Forms are not just about replacing FormControl with Signals.",
    "The bigger idea is composable form architecture.",
    "With:",
    {
      "type": "code",
      "language": "text",
      "code": "signal()\n    +\nform()\n    +\nFormField\n    +\nFormValueControl\n    +\nFormCheckboxControl\n    +\nschema()"
    },
    "we can build reusable, type-safe, reactive form controls without manually wiring every component through ControlValueAccessor.",
    "The most important architectural principle is:",
    {
      "type": "aside",
      "text": "Let the custom control own the UI. Let the form schema own the rules. Let Signals connect the two."
    },
    "That separation makes complex Angular forms easier to build, reuse, test, and maintain.",
    {
      "type": "heading",
      "text": "References"
    },
    {
      "type": "link",
      "text": "Angular documentation: custom Signal Form controls",
      "href": "https://angular.dev/guide/forms/signals/custom-controls"
    }
  ]
};
