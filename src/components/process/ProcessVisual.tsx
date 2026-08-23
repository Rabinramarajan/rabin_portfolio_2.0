"use client";

import type { ProcessVisualId } from "@/content/types";

export function ProcessVisual({ id }: { id: ProcessVisualId; reduce?: boolean }) {
  const images: Record<ProcessVisualId, string> = {
    discover: "/media/process/discover.png",
    define: "/media/process/Define.png",
    design: "/media/process/Design.png",
    build: "/media/process/Engineer.png",
    test: "/media/process/Validate.png",
    launch: "/media/process/Launch.png",
    evolve: "/media/process/Evolve.png",
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
