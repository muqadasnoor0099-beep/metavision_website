import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

const CHROME = 'C:/Users/hp/.cache/puppeteer/chrome/win64-127.0.6533.88/chrome-win64/chrome.exe'
const DIR    = './temporary screenshots'

if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true })

const existing = readdirSync(DIR).filter(f => f.endsWith('.png'))
const nums = existing.map(f => parseInt(f.match(/(\d+)/)?.[1] ?? '0')).filter(n => !isNaN(n))
const next = nums.length ? Math.max(...nums) + 1 : 1

const url   = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] ? `-${process.argv[3]}` : ''
const file  = join(DIR, `screenshot-${next}${label}.png`)

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] })
const page    = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await new Promise(r => setTimeout(r, 1500))
await page.screenshot({ path: file, fullPage: true })
await browser.close()
console.log(`Saved: ${file}`)
