/**
 * The case-study line-icon set.
 *
 * One stroke weight, one 24-unit box and `currentColor` throughout, so every
 * icon inherits the accent from the element that holds it and none of them
 * carry a colour of their own. They are decorative in every use on the page —
 * the label beside an icon always carries the meaning — so each is rendered
 * `aria-hidden` by the shared wrapper below.
 */
type IconProps = { className?: string };

function Svg({ children, className }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconClock(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Svg>
  );
}

export function IconMonitor(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="4.5" width="18" height="12" rx="1.6" />
      <path d="M9 20h6M12 16.5V20" />
    </Svg>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.4 12.2 2.5 2.4 4.7-5" />
    </Svg>
  );
}

export function IconUsers(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16 6.4a3 3 0 0 1 0 5.2M17.2 14.4c2 .7 3.3 2.4 3.3 4.6" />
    </Svg>
  );
}

export function IconCalendar(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.8" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </Svg>
  );
}

export function IconBriefcase(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="7" width="18" height="13" rx="1.8" />
      <path d="M9 7V5.2A1.2 1.2 0 0 1 10.2 4h3.6A1.2 1.2 0 0 1 15 5.2V7M3 12.5h18" />
    </Svg>
  );
}

export function IconLayers(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m12 3.5 8 4.2-8 4.2-8-4.2z" />
      <path d="m4 12 8 4.2 8-4.2M4 16.2l8 4.2 8-4.2" />
    </Svg>
  );
}

export function IconBolt(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M13.2 3 5.5 13.4h5.2L10.2 21l7.7-10.4h-5.2z" />
    </Svg>
  );
}

export function IconGrid(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
    </Svg>
  );
}

export function IconCompass(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-1.8 4.2L9 15l1.8-4.2z" />
    </Svg>
  );
}

export function IconBlueprint(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="1.6" />
      <path d="M4 9.5h16M9.5 9.5V20M13 13.5h4M13 16.5h4" />
    </Svg>
  );
}

export function IconPen(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M15.2 4.6 19.4 8.8 8.6 19.6l-5 .8.8-5z" />
      <path d="m13.2 6.6 4.2 4.2" />
    </Svg>
  );
}

export function IconCode(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5l-3 14" />
    </Svg>
  );
}

export function IconGauge(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 12l3.6-3.6" />
      <circle cx="12" cy="12" r="1.4" />
    </Svg>
  );
}

export function IconArrow(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 12h15M14 6.5 19.5 12 14 17.5" />
    </Svg>
  );
}

export function IconSpark(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6.2 6.2l2.6 2.6M15.2 15.2l2.6 2.6M17.8 6.2l-2.6 2.6M8.8 15.2l-2.6 2.6" />
    </Svg>
  );
}

export function IconImage(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="5" width="17" height="14" rx="1.8" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m4.5 17 4.8-4.5 3.4 3 2.6-2.2 4.2 3.7" />
    </Svg>
  );
}

/** The five process movements, in the order the solution rail renders them. */
export const PROCESS_ICONS = [IconCompass, IconBlueprint, IconPen, IconCode, IconGauge];
