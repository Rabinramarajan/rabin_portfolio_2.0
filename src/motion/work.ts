/**
 * Work Section GSAP Animations
 * Signature project card animations, pinned project stories, and image transforms
 */

import { useRef } from "react";
import { useGSAPContext, prefersReducedMotion } from "./gsap-context";
import { MOTION_CONFIG } from "./config";

const gsap = require("gsap/dist/gsap");

/**
 * useWorkMotion — Project section choreography
 * - Staggered card entrance
 * - Image parallax on scroll
 * - Project card hover effects
 * - Pinned project story sequence
 */
export function useWorkMotion(ref: React.RefObject<HTMLElement>) {
  const reduce = prefersReducedMotion();

  useGSAPContext(ref, (ctx) => {
    if (reduce) return;

    const container = ref.current;
    if (!container) return;

    // ========== PROJECT CARD GRID REVEAL ==========
    const cards = container.querySelectorAll("[data-motion='work-card']");
    if (cards.length > 0) {
      gsap.from(cards, {
        duration: MOTION_CONFIG.duration.standard,
        delay: 0.1,
        stagger: MOTION_CONFIG.stagger.item,
        y: 60,
        opacity: 0,
        ease: MOTION_CONFIG.ease.entrance,
        scrollTrigger: {
          trigger: container,
          start: "top 75%",
          end: "top 25%",
          scrub: false,
          markers: false,
        },
      });
    }

    // ========== PROJECT IMAGE PARALLAX ==========
    const images = container.querySelectorAll("[data-motion='work-image']");
    images.forEach((img) => {
      gsap.to(img, {
        y: 40,
        scrollTrigger: {
          trigger: img,
          start: "top center",
          end: "bottom center",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });
    });

    // ========== PROJECT CARD HOVER SCALE ==========
    const cardLinks = container.querySelectorAll("[data-motion='work-card-link']");
    cardLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        gsap.to(link, {
          scale: 1.02,
          duration: MOTION_CONFIG.duration.ui,
          ease: MOTION_CONFIG.ease.smooth,
        });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(link, {
          scale: 1,
          duration: MOTION_CONFIG.duration.ui,
          ease: MOTION_CONFIG.ease.smooth,
        });
      });
    });

    // ========== FEATURED PROJECT ANIMATION ==========
    const featuredProject = container.querySelector("[data-motion='featured-project']");
    if (featuredProject) {
      const featuredImage = featuredProject.querySelector("[data-motion='featured-image']");
      const featuredMeta = featuredProject.querySelector("[data-motion='featured-meta']");
      const featuredTitle = featuredProject.querySelector("[data-motion='featured-title']");
      const featuredTech = featuredProject.querySelector("[data-motion='featured-tech']");
      const featuredCta = featuredProject.querySelector("[data-motion='featured-cta']");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredProject,
          start: "top 60%",
          end: "bottom 40%",
          scrub: MOTION_CONFIG.scroll.scrub,
          markers: false,
        },
      });

      // Image scale and shift
      if (featuredImage) {
        tl.from(
          featuredImage,
          {
            scale: 0.9,
            opacity: 0,
            y: 40,
            duration: MOTION_CONFIG.duration.cinematic,
          },
          0
        );
      }

      // Metadata reveal
      if (featuredMeta) {
        tl.from(
          featuredMeta,
          {
            opacity: 0,
            x: -30,
          },
          0.2
        );
      }

      // Title reveal
      if (featuredTitle) {
        tl.from(
          featuredTitle,
          {
            opacity: 0,
            y: 20,
          },
          0.3
        );
      }

      // Technology tags
      if (featuredTech) {
        const tags = featuredTech.querySelectorAll("[data-motion='tech-tag']");
        tl.from(
          tags,
          {
            opacity: 0,
            scale: 0.9,
            stagger: 0.05,
          },
          0.4
        );
      }

      // CTA activation
      if (featuredCta) {
        tl.from(
          featuredCta,
          {
            opacity: 0,
            scale: 0.9,
          },
          0.5
        );
      }
    }

    // ========== PINNED PROJECT STORY ==========
    // Desktop: pin left/right sections while content scrolls
    const pinnedStory = container.querySelector("[data-motion='pinned-story']");
    if (pinnedStory) {
      const storyVisual = pinnedStory.querySelector("[data-motion='story-visual']");
      const storyContent = pinnedStory.querySelector("[data-motion='story-content']");
      const storyStages = storyContent?.querySelectorAll("[data-motion='story-stage']");

      if (storyVisual && storyStages && storyStages.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedStory,
            pin: true,
            pinSpacing: true,
            start: "top top",
            end: `+=${storyStages.length * 200}%`,
            scrub: MOTION_CONFIG.scroll.scrub,
            markers: false,
          },
        });

        // Animate through each story stage
        storyStages.forEach((stage, index) => {
          // Current stage fades in
          tl.from(
            stage,
            {
              opacity: 0,
              y: 20,
              duration: MOTION_CONFIG.duration.standard,
            },
            index * 1
          );

          // Image transform for each stage
          if (storyVisual) {
            tl.to(
              storyVisual,
              {
                opacity: 0.8 + Math.sin(index * 0.5) * 0.2,
                duration: MOTION_CONFIG.duration.standard,
              },
              index * 1
            );
          }

          // Exit current stage
          if (index < storyStages.length - 1) {
            tl.to(
              stage,
              {
                opacity: 0,
                y: -20,
                duration: MOTION_CONFIG.duration.standard,
              },
              (index + 1) * 1 - 0.2
            );
          }
        });
      }
    }
  });
}

/**
 * useProjectCardMotion — Individual project card hover animations
 * Used on project cards for magnetic and scale effects
 */
export function useProjectCardMotion(ref: React.RefObject<HTMLElement>) {
  const reduce = prefersReducedMotion();

  useGSAPContext(ref, (ctx) => {
    if (reduce) return;

    const card = ref.current;
    if (!card) return;

    const image = card.querySelector("[data-motion='card-image']");
    const overlay = card.querySelector("[data-motion='card-overlay']");

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.02,
        duration: MOTION_CONFIG.duration.ui,
        ease: MOTION_CONFIG.ease.smooth,
      });

      if (image) {
        gsap.to(image, {
          scale: 1.05,
          duration: MOTION_CONFIG.duration.ui,
          ease: MOTION_CONFIG.ease.smooth,
        });
      }

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.5,
          duration: MOTION_CONFIG.duration.ui,
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        duration: MOTION_CONFIG.duration.ui,
        ease: MOTION_CONFIG.ease.smooth,
      });

      if (image) {
        gsap.to(image, {
          scale: 1,
          duration: MOTION_CONFIG.duration.ui,
          ease: MOTION_CONFIG.ease.smooth,
        });
      }

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: MOTION_CONFIG.duration.ui,
        });
      }
    });
  });
}
