# Peptalith legal and footer rebrand

- Published local `/waiver-agreement-policy/` and `/disclaimer/` pages, including prerendered HTML, canonical metadata, sitemap entries, and routing configuration.
- Preserved all eight clauses of the original waiver from `https://purehealthpeptides.com/waiver-agreement-policy/`, replacing the business name and policy destinations and formatting paragraphs. The disclaimer reflects the current Peptalith store policies and footer notices.
- Both desktop and mobile shared footers now use local legal routes. Checkout's existing required research acknowledgement explicitly links to the waiver, terms, disclaimer, and privacy policy.
- `npm run check` passed: typecheck, lint, 33 server tests, 21 component tests, build, bundle budgets, 148-page HTML/footer checks, 776 HTTP checks, branding, and client-secret scanning.

## Deferred work

The user instructed: “Finish legal/footer now; move reports later.” Original COA report destinations are intentionally unchanged. There are 636 unique source PDFs; the original domain currently resolves to `127.0.0.1`. Migration requires original PDFs or a working backup source. Existing certificate artwork and source attribution are preserved.

The retained waiver's section 6 describes product-access gating and OTP verification at checkout. The current storefront has a required checkout research/age acknowledgement but allows guest checkout without an OTP. Preserving the original text does not implement those additional access controls; this remains a separate implementation gap.
