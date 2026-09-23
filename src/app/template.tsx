import { CinematicLayer } from "@/components/motion/CinematicLayer";

/**
 * The per-navigation wrapper.
 *
 * CinematicLayer is mounted here rather than in the layout on purpose: it
 * reads the route markup and writes inline transforms into it, and a layout
 * effect runs while the route segment beside it is still hydrating — which
 * leaves React hydrating against a DOM GSAP has already touched ("a tree
 * hydrated but some attributes ... did not match", which React does not patch
 * up). The template belongs to the segment, so it commits with the page it is
 * about to animate, and it remounts on every navigation, which is exactly
 * when the layer has to scan again.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter">
      {children}
      <CinematicLayer />
    </div>
  );
}
