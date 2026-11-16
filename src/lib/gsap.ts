"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { useGSAP } from "@gsap/react"

// Every GSAP plugin is free since the Webflow acquisition (incl. SplitText & DrawSVG).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, useGSAP)
  gsap.defaults({ ease: "power3.out", duration: 1 })
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
