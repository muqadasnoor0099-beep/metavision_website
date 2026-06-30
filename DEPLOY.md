# Deploy to GitHub and Vercel (with demo video)

## Demo file

The site plays **`/demos/ha-engage-pro.mp4`**, which must live at **`public/demos/ha-engage-pro.mp4`**.

1. After you render in Remotion, run from the **site repo root** (this folder):

   ```bash
   npm run sync-demo
   ```

   That copies **`remotion-videos/out/ha-engage-pro.mp4`** → **`public/demos/ha-engage-pro.mp4`**.

2. **Commit the copy under `public/demos/`** and push to GitHub (recommended so Vercel does not need the Remotion project or a re-render on every build).

   ```bash
   git add public/demos/ha-engage-pro.mp4
   git commit -m "Add HA EngagePro demo video for production"
   ```

   ~20 MB is fine for normal Git (under GitHub’s 100 MB hard limit). For much larger files later, consider [Git LFS](https://git-lfs.com/) or hosting the file on object storage and changing the URL in `lib/constants.ts`.

## Vercel

This project uses **Next.js static export** (`output: 'export'`). **`vercel.json`** is already set to:

- `buildCommand`: `npm run build` (runs **`prebuild`** → **`sync-demo`**, then **`next build`**)
- `outputDirectory`: **`out`**

Steps:

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Leave defaults; Vercel will read **`vercel.json`**.

If **`public/demos/ha-engage-pro.mp4`** is already committed, **`sync-demo`** during **`prebuild`** will detect it and leave it as-is when Remotion output is missing on Vercel’s build machine.

## Optional: do not commit `remotion-videos/node_modules`

If `remotion-videos` is in the same repo, add **`remotion-videos/node_modules`** to **`.gitignore`** so it is never pushed (large and reproducible with `npm install` inside that folder).
