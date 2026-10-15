import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { productionRoutes, SITE_ORIGIN } from './site-routes.mjs'

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'))
const oldBrand = /\bpure\s+(?:health|elite)\b/i
assert.equal(SITE_ORIGIN, 'https://peptalith.com')
const manifest = await readJson('public/site.webmanifest')
assert.equal(manifest.name, 'Peptalith')
assert.equal(manifest.short_name, 'Peptalith')
for (const route of productionRoutes) {
  const metadata = JSON.stringify({ title: route.title, description: route.description, schema: route.schema })
  assert.ok(!oldBrand.test(metadata), `Old branding in metadata: ${route.path}`)
  assert.ok(!route.title.includes('| PHP'), `Old abbreviation in title: ${route.path}`)
  assert.ok(!metadata.includes('purehealthpeptidesshop.com'), `Old storefront domain: ${route.path}`)
}
const documents = await readJson('src/productDocumentManifest.json')
for (const [slug, entry] of Object.entries(documents)) {
  const document = await readJson(`public${entry.url}`)
  const copy = JSON.stringify({ title: document.detail.title, documentTitle: document.detail.documentTitle, shortDescriptionHtml: document.detail.shortDescriptionHtml, descriptionHtml: document.detail.descriptionHtml })
  assert.ok(!oldBrand.test(copy), `Old copy in active product document: ${slug}`)
}
const images = await readJson('catalog/branding-image-regions.json')
const digest = async (file) => createHash('sha256').update(await readFile(file)).digest('hex')
let updated = 0, certificates = 0
for (const image of images.images) {
  assert.ok(image.outputHash, `Image has not been processed: ${image.files[0]}`)
  for (const file of image.files) {
    assert.equal(await digest(file), image.outputHash, `Rebranded image differs from reviewed output: ${file}`)
    updated++
  }
}
for (const certificate of images.preservedCertificates) {
  for (const file of certificate.files) {
    assert.equal(await digest(file), certificate.sha256, `Original certificate changed: ${file}`)
    certificates++
  }
}
console.log(`Branding QA passed: ${productionRoutes.length} route metadata records, ${Object.keys(documents).length} active product documents, ${updated} image files, ${certificates} unchanged certificate images.`)
