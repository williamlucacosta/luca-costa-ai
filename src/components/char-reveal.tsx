import { Fragment } from "react"
import { cn } from "@/lib/utils"

/**
 * Per-letter rise for above-the-fold titles, in pure CSS: the letters are in the server HTML
 * and animate as soon as the page paints, without waiting for JavaScript (fast LCP).
 * Screen readers get the whole word from aria-label; the letter spans are hidden from them.
 */
export function CharReveal({
  as: Comp = "h1",
  text,
  className,
  delay = 100,
}: {
  as?: "h1" | "h2"
  text: string
  className?: string
  delay?: number
}) {
  let i = 0
  return (
    <Comp aria-label={text} className={cn(className)}>
      {text.split(" ").map((word, w) => (
        // the space sits between the word boxes: inside an inline-block it would be trimmed away
        <Fragment key={w}>
          {w > 0 && " "}
          <span aria-hidden className="inline-block whitespace-nowrap">
            {[...word].map((ch) => (
              <span key={i} className="char-in inline-block" style={{ animationDelay: `${delay + i++ * 35}ms` }}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </Comp>
  )
}
