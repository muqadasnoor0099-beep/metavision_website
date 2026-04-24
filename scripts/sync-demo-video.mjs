/**
 * Copy HA EngagePro render into `public/demos/` so Next.js serves `/demos/ha-engage-pro.mp4`.
 * Order: remotion-videos/out (Remotion default) → repo root out/ → skip if public already has file.
 *
 * Run locally: npm run sync-demo
 * Vercel: runs automatically via npm prebuild before next build.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const destDir = path.join(root, 'public', 'demos')
const dest = path.join(destDir, 'ha-engage-pro.mp4')

const candidates = [
  path.join(root, 'remotion-videos', 'out', 'ha-engage-pro.mp4'),
  path.join(root, 'out', 'ha-engage-pro.mp4'),
]

const src = candidates.find((p) => fs.existsSync(p))

if (src) {
  fs.mkdirSync(destDir, { recursive: true })
  fs.copyFileSync(src, dest)
  const mb = (fs.statSync(dest).size / (1024 * 1024)).toFixed(1)
  console.log(`[sync-demo] copied → public/demos/ha-engage-pro.mp4 (${mb} MB) from ${path.relative(root, src)}`)
  process.exit(0)
}

if (fs.existsSync(dest)) {
  const mb = (fs.statSync(dest).size / (1024 * 1024)).toFixed(1)
  console.log(`[sync-demo] keeping existing public/demos/ha-engage-pro.mp4 (${mb} MB)`)
  process.exit(0)
}

console.warn(
  '[sync-demo] No ha-engage-pro.mp4 found. Add one of:\n' +
    '  - remotion-videos/out/ha-engage-pro.mp4 (Remotion render)\n' +
    '  - out/ha-engage-pro.mp4\n' +
    'Then run: npm run sync-demo',
)
process.exit(0)
