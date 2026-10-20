# Editorial cinematic luxury

The brief governs the design. UI/UX Pro Max was inspected and queried; its first
candidate (brutalism/light palette) was rejected as a poor fit. Its useful guidance
on readable narrative, responsive images, restrained motion, and accessibility is
retained. A focused follow-up supported minimal typography and a disciplined grid.

## Tokens

- Canvas `#0B0B0B`; secondary `#121212`; text `#F3F0E9`; muted `#96938E`.
- Accent `#C6AE83` for small labels, focus and select interactions.
- Borders `rgba(243,240,233,.12)`; square media frames; circular play affordances.
- Bodoni Moda: editorial display, 400 normal/italic. Manrope: UI and body, 400–700.
  Both are SIL Open Font License fonts, self-hosted through `next/font/local`.
- Type: hero `clamp(3rem,8.6vw,8.6rem)`; section `clamp(2.8rem,5.6vw,5.7rem)`;
  body 15–18px, 1.7 line-height; labels 10–12px, .14em tracking.
- Spacing: 4/8/12/16/24/32/48/64/96/128px. Fluid gutters 22–80px.
- Container maximum 1600px; breakpoints 640px, 900px, 1200px.

## Composition

Quiet navigation, a single poster-led cinematic opening, oversized two-line serif
headline, and a compact film caption. The hero is static until deliberately played.
Selected work uses a 12-column grid: the first film spans eight columns beside an
editorial note when alone; multiple films form alternating 8/4 and 5/7 compositions.
Services are typographic rows. About pairs a clearly captioned still with editable
philosophy. The closing CTA is intentionally spacious.

Only the supplied Mux preview is used. Its source contains Mux demonstration
content; it is labeled as a supplied preview with provisional metadata, never
claimed as a named client commission. No stock work, invented identity or metrics.

## Components and motion

React Bits BlurText source was reviewed. A focused local adaptation retains its
word-by-word Motion animation, removes extra modes, blur, looping and hover logic,
and keeps text visible in the initial server render. Source/license attribution is
in THIRD_PARTY_NOTICES.md. Motion is the only animation dependency.

Hero word movement: 700ms, 60ms stagger; section movement: 550ms, once; interface
feedback: 220ms; image hover: 600ms, scale 1.025. No parallax, cursor effects or
scroll interception. Reduced motion disables transforms, animation, and smooth
scrolling. Content is available without JavaScript.

## Accessibility and states

Semantic landmarks, one h1 per route, visible 2px accent focus with 5px offset,
44px minimum interactive targets, underlined text links, skip link, no hover-only
metadata. Mobile navigation is a disclosure with Escape and focus restoration.
Native dialog handles modal focus/inert background, Escape, and return focus.
Video controls are Mux's accessible native-media controls, never autoplay audio.

Posters reserve space and fall back to a local neutral frame. Video code is loaded
on explicit play only. Missing IDs show a poster with a clear status; errors offer
retry. Contact links render only when valid; missing contact has a visible status.
Unpublished projects are filtered on the server before any client props or metadata.
