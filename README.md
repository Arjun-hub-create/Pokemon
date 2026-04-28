# Pokédex Lite

My submission for the frontend assignment. Built with React + Vite.

Live demo: [add your vercel link here]

---

## Setup

```bash
npm install
npm run dev
```

Opens on localhost:3000. You'll need Node 18+, I was on Node 20 while building this.

```bash
npm run build    # 
```

---

## What I built

Full Pokédex app with search, type filtering, pagination, favorites and a detail modal. Went with a jungle theme because I wanted something that actually looked different from the usual dark-mode card grid everyone does.

Covers all the mandatory requirements:
- Pokémon grid fetched from PokéAPI, 20 per page
- Search by name (filters as you type)
- Type filter (multi-select, can combine types)
- Pagination with prev/next and numbered pages
- Favorites saved to localStorage so they survive a refresh
- Detail modal with stats, abilities, moves, sprites
- Works on mobile, tablet, desktop

---

## Tech choices

**React** — honestly just what I'm most comfortable with for something that has this many pieces talking to each other. Search state, filter state, pagination, modal open/closed — that's a lot to keep in sync and React hooks make it manageable.

**Vite** — used this instead of CRA because CRA is slow and I've been burned by it before. Vite just works.

**No Tailwind, plain CSS** — I went back and forth on this. Tailwind would've been faster to write but I wanted the type-based colour system where each Pokémon card glows a different colour depending on its type (fire cards glow orange, water cards glow blue etc.), and doing that dynamically with CSS custom properties felt cleaner than generating Tailwind classes on the fly.

**PokéAPI** — free, no auth needed, has everything. The docs are decent.

---

## How the API stuff works

I spent a while figuring out the right way to do this because naively fetching all 649 Pokémon upfront would be like 649 separate API calls which is obviously bad.

What I ended up doing:

First call on load fetches just the list of names — `GET /pokemon?limit=649`. That's one request and it's small because it's just names and URLs, no images or stats yet.

Search filtering happens in memory against that list. No extra API calls.

Type filtering was the tricky part. My first attempt fetched the full details for every Pokémon and checked their types — that worked but it was hammering the API. The better way is to call `GET /type/fire` (or whatever type) which gives you back every Pokémon of that type in one shot. Way more efficient and the response gets cached so you don't re-fetch it when you change pages.

Then once I know which 20 Pokémon belong on the current page, I fetch their full details — sprites, stats, abilities etc. Those also get cached so navigating backwards is instant.

---

## Folder structure

```
src/
├── components/
│   ├── HeroSection.jsx        entrance screen with dancing pokemon
│   ├── JungleBackground.jsx   leaves, vines, fireflies animation
│   ├── BgFloaters.jsx         faint pokemon silhouettes in bg
│   ├── PokemonCard.jsx        grid card
│   ├── PokemonModal.jsx       detail modal
│   ├── TypeFilters.jsx        type chips
│   ├── Pagination.jsx         page nav
│   ├── StatsBar.jsx           animated counters
│   ├── ScrollProgressBar.jsx  top progress bar
│   ├── FavoritesView.jsx      saved pokemon
│   └── Toast.jsx              notifications
├── hooks/
│   ├── usePokemon.js          fetching + favorites + toast
│   └── useScroll.js           scroll reveal + scroll position
├── utils/
│   └── typeColors.js          18 type → hex colour map
├── styles/
│   └── globals.css
├── App.jsx
└── main.jsx
```

---

## Stuff I'd do differently or add

The type filtering only works against Gen 1-5 right now (649 Pokémon). Could easily bump that limit up, I just kept it at 649 to keep the initial list load fast.

Would've liked to add the evolution chain to the detail modal — the API has it at `/evolution-chain/:id` but you have to get there through the species endpoint first, so it's two extra calls per Pokémon and I ran out of time to build that cleanly.

URL state (putting the current search/filter/page in the URL) would make it way more shareable and also fix the back button. Didn't get to it.

Loading skeletons instead of a spinner would look much better. The spinner is fine but skeletons give users a sense of the layout before content loads.

Didn't attempt the bonus OAuth — not because I don't know how, but setting up a Google OAuth client properly, handling the callback, storing tokens, it's a whole thing and I didn't want to half-do it.

---

## Deploying

```bash
npx vercel
```

or drag /dist to netlify.com/drop after running `npm run build`.
