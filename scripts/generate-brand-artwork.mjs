import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { rebrandCoaMontage } from './rebrand-coa-montage.mjs'

const motion = `<style>
  .molecule-structure{transform-origin:30px 30px;animation:molecule-spin 28s linear infinite}
  .molecule-core{transform-origin:30px 30px;animation:molecule-breathe 4.8s ease-in-out infinite}
  .molecule-orbit{transform-origin:30px 30px;animation:molecule-spin 12s linear infinite reverse}
  @keyframes molecule-spin{to{transform:rotate(360deg)}}
  @keyframes molecule-breathe{0%,100%{opacity:.8;transform:scale(.92)}50%{opacity:1;transform:scale(1.08)}}
  @media(prefers-reduced-motion:reduce){.molecule-structure,.molecule-core,.molecule-orbit{animation:none}}
</style>`
const molecule = `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
  <g class="molecule-orbit" opacity=".5"><ellipse cx="30" cy="30" rx="28" ry="14" transform="rotate(-28 30 30)" stroke="#88d0e9" stroke-width=".9"/><circle cx="54.7" cy="17" r="2" fill="#239bc8"/></g>
  <g class="molecule-structure"><path d="M30 7 50 18v24L30 53 10 42V18ZM30 30 30 7M30 30 50 42M30 30 10 42" stroke="#243167" stroke-width="1.8"/>
  <circle cx="30" cy="7" r="4" fill="#239bc8" stroke="#239bc8"/><circle cx="50" cy="18" r="3.6" fill="#ffffff" stroke="#243167" stroke-width="1.8"/><circle cx="50" cy="42" r="4.6" fill="#88d0e9" stroke="#239bc8" stroke-width="1.5"/><circle cx="30" cy="53" r="3.5" fill="#239bc8"/><circle cx="10" cy="42" r="4" fill="#ffffff" stroke="#243167" stroke-width="1.8"/><circle cx="10" cy="18" r="4.6" fill="#239bc8"/>
  </g><g class="molecule-core"><circle cx="30" cy="30" r="9" fill="#88d0e9" opacity=".2"/><circle cx="30" cy="30" r="5.2" fill="#239bc8"/><circle cx="28.6" cy="28.4" r="1.4" fill="#ffffff" opacity=".9"/></g>
</g>`
const wordmark = (await readFile('public/assets/wordmark.svg', 'utf8')).match(/<g[\s\S]*<\/g>/)[0].replace('<g ', '<g fill="none" ')
const staticMark = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><title>Peptalith molecular symbol</title>${molecule}</svg>\n`
const animatedMark = staticMark.replace(molecule, motion + molecule)
await writeFile('public/assets/molecule-static.svg', staticMark)
await writeFile('public/assets/molecule-mark.svg', animatedMark)
await writeFile('public/assets/logo.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="251" height="44" viewBox="0 0 251 44" fill="none" role="img" aria-label="Peptalith"><title>Peptalith</title>${motion}<g transform="translate(1 0) scale(.73)">${molecule}</g><g transform="translate(61 11) scale(1.01)">${wordmark}</g></svg>\n`)
await writeFile('public/assets/footer-logo.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="275" height="136" viewBox="0 0 275 136" fill="none" role="img" aria-label="Peptalith"><title>Peptalith</title>${motion}<g transform="translate(97 0) scale(1.35)">${molecule.replaceAll('#243167', '#88d0e9').replaceAll('#ffffff', '#081a32')}</g><g transform="translate(13 99) scale(1.34)">${wordmark.replaceAll('#243167', '#ffffff').replace('stroke-width="1.8"', 'stroke-width="1.5"')}</g></svg>\n`)
await writeFile('public/assets/product-detail/logo-bg.svg', staticMark)
await writeFile('public/assets/newsletter-bg.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1367" height="399" viewBox="0 0 1367 399"><g opacity=".15" transform="translate(860 -160) scale(10)">${molecule}</g></svg>\n`)
await sharp(Buffer.from(staticMark)).resize(100,100).png().toFile('public/assets/favicon.png')

await rebrandCoaMontage()
for (const [source, target] of [
  ['logo.svg', 'peptalith-logo.svg'], ['footer-logo.svg', 'peptalith-footer-logo.svg'],
  ['favicon.png', 'peptalith-favicon.png'], ['newsletter-bg.svg', 'molecule-newsletter-bg.svg'],
  ['product-detail/logo-bg.svg', 'product-detail/molecule-bg.svg'],
]) await writeFile(`public/assets/${target}`, await readFile(`public/assets/${source}`))
console.log('Generated molecular brand artwork, animated logos, favicon, and the original rebranded documentation montage.')
