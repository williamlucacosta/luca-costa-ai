import type Lenis from "lenis"

/**
 * Shared state for the in-page "warp" jump. The nav writes `warp.v` (0 → 1 → 0),
 * the background shader and the blur veil read it every frame.
 */
export const warp = { v: 0 }

export const scroller: { lenis: Lenis | null } = { lenis: null }
