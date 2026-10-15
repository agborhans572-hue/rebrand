import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import sharp from 'sharp'

const manifestPath = resolve('catalog/branding-image-regions.json')
const plan = JSON.parse(await readFile(manifestPath, 'utf8'))
const preview = process.argv.includes('--preview')
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex')
const wordmark = await readFile('public/assets/wordmark.svg', 'utf8')
const molecule = await readFile('public/assets/molecule-static.svg', 'utf8')
await mkdir('artifacts/rebrand-originals', { recursive: true })
if (preview) await mkdir('artifacts/rebrand-samples', { recursive: true })
let updated = 0, skipped = 0

for (const entry of plan.images) {
  const original = await readFile(entry.files[0])
  const digest = sha(original)
  if (digest === entry.outputHash) { skipped += entry.files.length; continue }
  if (digest !== entry.sourceHash) throw new Error(`Source changed; review branding regions for ${entry.files[0]}`)
  const { data, info } = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const layers = []
  for (const patch of entry.regions) {
    const [nx, ny, nw, nh] = patch.box
    const left = Math.round(nx * info.width), top = Math.round(ny * info.height)
    const width = Math.min(Math.round(nw * info.width), info.width - left)
    const height = Math.min(Math.round(nh * info.height), info.height - top)
    const topRow = Math.round((patch.sampleTop ?? ny - .005) * info.height)
    const bottomRow = Math.round((patch.sampleBottom ?? ny + nh + .005) * info.height)
    const background = Buffer.alloc(width * height * 4)
    const solid = patch.background ? [...Buffer.from(patch.background.slice(1), 'hex'), 255] : null
    for (let y = 0; y < height; y++) {
      const blend = y / Math.max(1, height - 1)
      for (let x = 0; x < width; x++) {
        for (let channel = 0; channel < 4; channel++) {
          const sampled = patch.sampleX == null ? null : data[((top + y) * info.width + Math.round(patch.sampleX * info.width)) * 4 + channel]
          const upper = solid ? solid[channel] : sampled ?? data[(topRow * info.width + left + x) * 4 + channel]
          const lower = solid ? solid[channel] : sampled ?? data[(bottomRow * info.width + left + x) * 4 + channel]
          background[(y * width + x) * 4 + channel] = Math.round(upper * (1 - blend) + lower * blend)
        }
      }
    }
    layers.push({ input: await sharp(background, { raw: { width, height, channels: 4 } }).png().toBuffer(), left, top })
    const color = patch.color || '#243167'
    const graphic = patch.kind === 'molecule'
      ? molecule.replaceAll('#243167', color).replaceAll('#239bc8', color).replaceAll('#88d0e9', color)
      : patch.text
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><text x="0" y="${height * .79}" font-family="Arial,sans-serif" font-size="${height * .8}" fill="${color}">${patch.text}</text></svg>`
      : wordmark.replaceAll('#243167', color)
    const mark = await sharp(Buffer.from(graphic)).resize(Math.max(1, width - 4), Math.max(1, height - 4), { fit: 'contain', background: '#00000000' }).png().toBuffer()
    layers.push({ input: mark, left: left + Math.floor((width - (await sharp(mark).metadata()).width) / 2), top: top + Math.floor((height - (await sharp(mark).metadata()).height) / 2) })
  }
  let result = sharp(original).composite(layers)
  if ((await sharp(original).metadata()).hasAlpha) {
    const composited = await result.png().toBuffer()
    const rgb = await sharp(composited).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const alpha = await sharp(original).extractChannel('alpha').raw().toBuffer()
    result = sharp(rgb.data, { raw: rgb.info }).joinChannel(alpha, { raw: { width: info.width, height: info.height, channels: 1 } })
  }
  result = /\.png$/i.test(entry.files[0]) ? result.png() : result.jpeg({ quality: 97, chromaSubsampling: '4:4:4' })
  const output = await result.toBuffer()
  if (preview) {
    await writeFile(`artifacts/rebrand-samples/${basename(entry.files[0])}`, output)
  } else {
    await writeFile(`artifacts/rebrand-originals/${entry.sourceHash}`, original)
    for (const file of entry.files) {
      if (sha(await readFile(file)) !== entry.sourceHash) throw new Error(`Duplicate source changed: ${file}`)
      await writeFile(file, output)
    }
    entry.outputHash = sha(output)
  }
  updated += entry.files.length
}
if (!preview) await writeFile(manifestPath, `${JSON.stringify(plan, null, 2)}\n`)
console.log(`${preview ? 'Previewed' : 'Rebranded'} ${updated} image files; ${skipped} already current.`)
