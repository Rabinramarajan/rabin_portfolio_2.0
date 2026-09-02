/**
 * Chat chrome iconography.
 *
 * Every glyph is a 20×20 stroked path on `currentColor`, so a chip, a header
 * control and the send button all inherit their colour from the class around
 * them and stay optically consistent at the one size the panel uses them at.
 */

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10" cy="6.5" r="3" />
      <path d="M4 16.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5" />
    </Svg>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.75" y="6" width="14.5" height="10.25" rx="2" />
      <path d="M7.25 6V4.75a1.5 1.5 0 0 1 1.5-1.5h2.5a1.5 1.5 0 0 1 1.5 1.5V6" />
      <path d="M2.75 10.25h14.5" />
    </Svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="5.5" height="5.5" rx="1.5" />
      <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.5" />
      <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.5" />
      <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.5" />
    </Svg>
  );
}

export function IconSpark(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M10.5 2.5 4.5 11h4l-1 6.5 6-8.5h-4z" />
    </Svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="2" />
      <path d="m3.5 6 6.5 5 6.5-5" />
    </Svg>
  );
}

export function IconSend(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M17 3 8.5 11.5" />
      <path d="M17 3 11.5 17.5 8.5 11.5 2.5 8.5z" />
    </Svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16.5 8.5A6.5 6.5 0 0 0 5 5.5" />
      <path d="M3.5 11.5A6.5 6.5 0 0 0 15 14.5" />
      <path d="M4.75 2.5v3.2h3.2M15.25 17.5v-3.2h-3.2" />
    </Svg>
  );
}

export function IconMinimize(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4.5 10h11" />
    </Svg>
  );
}

export function IconExpand(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M11.5 3.5h5v5M8.5 16.5h-5v-5M16.5 3.5 11 9M3.5 16.5 9 11" />
    </Svg>
  );
}

export function IconCollapse(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M16.5 8.5h-5v-5M3.5 11.5h5v5M11.5 8.5 17 3M8.5 11.5 3 17" />
    </Svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m5 5 10 10M15 5 5 15" />
    </Svg>
  );
}

export function IconCheckDouble(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m2.5 10.5 3.5 3.5 6-7.5" />
      <path d="m9 13 1 1 6-7.5" />
    </Svg>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <svg
      className={props.className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11.4 1.8 4 11.2h4.2L7.4 18.2l7.6-9.6h-4.4z" />
    </svg>
  );
}

/** Maps a quick-action icon name from the config to its glyph. */
export const QUICK_ICONS = {
  user: IconUser,
  briefcase: IconBriefcase,
  grid: IconGrid,
  spark: IconSpark,
  mail: IconMail,
} as const;

export type QuickIconName = keyof typeof QUICK_ICONS;
