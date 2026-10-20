"use client";

// Focused adaptation of React Bits BlurText (MIT + Commons Clause); see THIRD_PARTY_NOTICES.md.
// Retains word staggering. No blur/loop/hover modes or hidden SSR content.
import { motion, useReducedMotion } from "motion/react";

export function BlurText({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <span className="headline-line">
    <span className="sr-only">{text}</span>
    {text.split(" ").map((word, index) => <motion.span
      aria-hidden="true" className="headline-word" key={`${word}-${index}`} initial={false}
      animate={reduced ? undefined : { y: [20, 0] }}
      transition={{ duration: 0.7, delay: delay + index * 0.06, ease: [0.22, 1, 0.36, 1] }}>
      {word}{index < text.split(" ").length - 1 ? "\u00a0" : ""}
    </motion.span>)}
  </span>;
}
