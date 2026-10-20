# Third-party sources

## React Bits

`src/components/ui/BlurText.tsx` is a deliberately reduced adaptation of
[React Bits BlurText](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/BlurText/BlurText.tsx),
reviewed during implementation. Copyright (c) 2026 David Haz.
The full **MIT + Commons Clause** license is preserved in
`public/licenses/react-bits.txt`. Use as part of this application is permitted;
standalone sale/redistribution of the component is restricted.

The implementation preserves word segmentation and Motion span staggering. It
removes all optional effects, blur, loops, randomized ranks, pointer-driven modes,
and hidden initial rendering. Reduced-motion handling and semantic span output
were added. Motion is the sole runtime animation dependency.

## Fonts

Bodoni Moda and Manrope were downloaded from the
[Google Fonts source repository](https://github.com/google/fonts).
Both are distributed under the SIL Open Font License. Original notices are in
`public/licenses/bodoni-moda.txt` and `public/licenses/manrope.txt`.
They are self-hosted using `next/font/local`; there is no runtime Google Fonts request.

## Media

The user supplied Mux playback ID `rR8P8mSaKDzz02TsftugTUdI00cQPJX00oy`.
Local JPEG posters were retrieved from Mux's supported thumbnail endpoint at
timestamps 8 seconds (concert) and 2 seconds (stadium). The stadium image is retained
as an alternative; the site uses the concert image. This source contains Mux
demonstration content, so the portfolio labels it as a supplied preview with
provisional credits. Confirm rights and replace it with the editor's actual
project before public launch.

No stock footage, client identities, portraits, awards, or testimonials were invented.

## Documentation consulted

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Tailwind + Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Motion installation](https://motion.dev/docs/react-installation)
- [Mux React player API](https://www.mux.com/docs/guides/player-api-reference/react)
- [Mux lazy loading](https://www.mux.com/docs/guides/player-lazy-loading)

UI/UX Pro Max was available locally and used for design-system guidance.
No 21st.dev MCP capability was available in the session.
