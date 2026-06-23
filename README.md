# Personal Website

![Website Preview](public/website-preview.webp)

> **Live Demo:** [slvlkn.cc](https://slvlkn.cc)

## About

Think of this repo as my little studio. I'm a design engineer who likes coding with style, so I use this site to mix "art" and logic, try weird ideas, and keep things feeling alive. I like the sweet spot where things look good and still feel fast.

## What's inside

- **Framework:** [Astro](https://astro.build) (server-rendered)
- **Styling:** Tailwind CSS v4
- **Data:** GitHub GraphQL API for the live activity graph
- **Linting & Formatting:** ESLint + Prettier
- **Hosting:** Cloudflare Workers
- **Package Manager:** Bun

## Run it locally

If you want to poke around:

```bash
# Clone the repository
git clone https://github.com/slavaluka/portfolio.git

# Install dependencies
bun install

# Copy the env template and add your GitHub token (powers the activity graph)
cp .env.example .env

# Start the dev server
bun run dev
```

The site shows up at `http://localhost:4308`

## Build & deploy

```bash
# Build for production
bun run build

# Preview the production build locally
bun run preview

# Deploy to Cloudflare Workers
bun run deploy
```

Runtime secrets (`GITHUB_TOKEN`, `GITHUB_USERNAME`) are read from the Worker
environment in production — set them in the Cloudflare dashboard, not in the repo.

## Project structure

```
├── public/              # Static assets (favicon, og-image, etc.)
├── src/
│   ├── assets/         # Images and project icons
│   ├── components/     # Astro components
│   │   ├── icons/      # Icon components
│   │   └── ui/         # Reusable UI primitives
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes
│   ├── styles/         # Global CSS with Tailwind
│   └── env.d.ts        # Ambient + Cloudflare runtime types
├── astro.config.mjs     # Astro configuration
└── wrangler.toml        # Cloudflare Workers configuration
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with 🤍 by [Sláva Lukianchuk](https://slvlkn.cc)
