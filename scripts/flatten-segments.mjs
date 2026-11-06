/**
 * Post-build fix for the static export.
 * Next writes per-segment prefetch files nested (out/it/__next.!KGl0KQ/it/__PAGE__.txt) but the
 * client requests them flattened with dots (/it/__next.!KGl0KQ.it.__PAGE__.txt). On a plain static
 * host every prefetch then 404s and logs console errors. Copy each nested file to its dotted name.
 */
import { copyFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"

const OUT = "out"
let copied = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name === "_next") continue
      if (name.startsWith("__next.")) flatten(dir, p)
      else walk(p)
    }
  }
}

// every file under <dir>/__next.<seg>/a/b/x.txt -> <dir>/__next.<seg>.a.b.x.txt
function flatten(base, segDir) {
  const visit = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) visit(p)
      else if (name.endsWith(".txt")) {
        const rel = relative(base, p).split(sep).join(".")
        copyFileSync(p, join(base, rel))
        copied++
      }
    }
  }
  visit(segDir)
}

walk(OUT)
console.log(`flatten-segments: ${copied} prefetch files`)
