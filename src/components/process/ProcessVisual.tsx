"use client";

import type { ProcessVisualId } from "@/content/types";
import { media } from "@/lib/media";

export function ProcessVisual({ id }: { id: ProcessVisualId; reduce?: boolean }) {
  const images: Record<ProcessVisualId, string> = {
    discover: media("other/process/discover.png"),
    define: media("other/process/define.png"),
    design: media("other/process/design.png"),
    build: media("other/process/engineer.png"),
    test: media("other/process/validate.png"),
    launch: media("other/process/launch.png"),
    evolve: media("other/process/evolve.png"),
  };

  return (
    <div className="pv pv--image" style={{ width: "100%", height: "100%", position: "relative" }}>
      <img
        src={images[id]}
        alt={`${id} process step illustration`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
