"use client";

/**
 * Client-only GSAP entrypoint. Importing this module registers ScrollTrigger
 * (and the useGSAP hook) exactly once, so components can import `gsap` /
 * `ScrollTrigger` from here without repeating registration or risking a
 * double-register during React strict-mode double effects.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
