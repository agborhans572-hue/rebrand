# Peptalith rebrand

The storefront now uses **Peptalith**, `https://peptalith.com`, `info@peptalith.com`, and `orders@peptalith.com`. The existing colors, layouts, products, prices, inventory IDs, and scientific content are retained. An animated molecular symbol replaces the infinity symbol; printed labels use a matching static symbol. The loyalty program is **Peptalith Elite Access** at `/peptalith-elite-access/`; old loyalty URLs redirect in one hop.

## Image assets

`catalog/branding-image-regions.json` records the reviewed branding regions, original image hashes, resulting hashes, duplicate paths, and preserved certificate hashes. `node scripts/rebrand-images.mjs` applies the same vector wordmark to matching original assets and skips already processed images. A different source hash stops processing for review. Original working copies are saved under ignored `artifacts/rebrand-originals/`; Git retains the original tracked assets.

The image edits use the scripted replacement method requested for this rebrand. Product names, strengths, QR codes, batch identifiers, and other product information are outside the edited branding regions. Original laboratory certificates, report screenshots, PDFs, and molecular diagrams remain unchanged.

`npm run generate:brand` generates the native SVG logos, static packaging symbol, favicon, decorative backgrounds, and the original documentation montage with branding-only replacements. Website marks rotate and breathe gently, with animation disabled for reduced-motion preferences. The homepage retains the original certificate montage composition, paper angles, shadows, charts, and laboratory branding. `scripts/rebrand-coa-montage.mjs` replaces only the storefront watermarks, client name, and URL in a separate marketing copy; the original image and issued certificates remain preserved. Use the new asset filenames in page markup to avoid stale cached logos.

Regenerate image derivatives and metadata after changing image assets:

```sh
npm run generate:images
node scripts/generate-production-files.mjs
node scripts/publish-catalog-artifacts.mjs
```

Social image filenames now include a digest so a changed label cannot reuse an old social image. Previous immutable catalog/image artifacts remain available for older deployments. Only the current manifests select the new files. Imported catalog marketing descriptions are normalized by `scripts/branding.mjs`; upstream document URLs and source snapshots retain their identities.

## Hosting and connected services

These source changes do not provision DNS, domain ownership, mailboxes, sender verification, or third-party account settings. Before the live domain cutover:

- Attach `peptalith.com` to the current host and point its DNS to that host. Configure redirects from the previous storefront domain at its host while preserving paths and queries.
- Set production `SITE_URL` and `VITE_SITE_URL` to `https://peptalith.com`; update Supabase site/redirect URLs and any OAuth allowed redirects.
- Provision `info@peptalith.com` and `orders@peptalith.com`, verify the sending domain, and set `CONTACT_FROM_EMAIL` and `ORDER_EMAIL_FROM`. Verify contact delivery and both order-email recipients.
- Update permitted domains for Turnstile, the chat widget, payment services, and any other provider that enforces origin allowlists.

`WOOCOMMERCE_URL`, existing integration routes/plugin identifiers, stored order numbers, and browser storage keys are retained to preserve compatibility. Original upstream laboratory-document and policy links remain available at their existing addresses.

Run `npm run check` for the application release gate and `npm run qa:branding` to verify current metadata, product documents, image outputs, and original certificate hashes.
