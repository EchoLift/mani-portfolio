"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main-content" className="not-found container"><p className="label accent">A BRIEF INTERRUPTION</p><h1>Let’s take<br />that again.</h1><p>Something interrupted this page. Please try again.</p><button className="text-link" onClick={reset}>Try again <span aria-hidden="true">↗</span></button></main>;
}
