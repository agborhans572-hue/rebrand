# Peptalith email configuration

## Production configuration

- Enquiry recipient: `info@peptalith.com`, fixed on the server in `netlify/functions/_shared/contact.ts`.
- Website sender: `Peptalith Website <info@peptalith.com>`, with the customer's address set as Reply-To.
- Supabase Auth sender: `Peptalith <info@peptalith.com>`, for confirmations and password resets.
- SMTP: `smtp.resend.com`, port `465` (TLS), username `resend`.
- Resend domain `peptalith.com` is verified in Ireland (`eu-west-1`). Added only the required `resend._domainkey` TXT and `rsend`/`send` CNAME records in Vercel DNS. Existing Zoho receiving, SPF, and DKIM records were retained. Resend receiving and link/open tracking remain disabled.
- Two separately approved, sending-only Resend keys are restricted to `peptalith.com`: `Peptalith Supabase Auth` and `Peptalith Website Enquiries`. The Auth key is encrypted in Supabase SMTP settings. The website key is a production-only Vercel Secret named `RESEND_API_KEY`; `CONTACT_FROM_EMAIL` is production configuration. No credentials are stored here or in browser build variables.
- Confirmation subject: `Confirm your Peptalith account`. Recovery subject: `Reset your Peptalith password`. The existing Supabase confirmation URL placeholders and production redirect allowlist were retained.

## Verification

- Resend displayed the sending domain as verified; public DNS queries resolved all three required records.
- Supabase SMTP settings persisted after reloading the dashboard.
- Production deployment `7i9U35zvYwbZjbdaMiEWR7y2am29` (`rebrand-mobenobiq-software333.vercel.app`) is Ready with the new Vercel settings.
- Submitted a labelled test through the live contact form. The form reported success and the full message arrived in the Zoho Inbox for `info@peptalith.com` at 08:41 EAT on October 17, 2026. The message was received over TLS.
- End-to-end Supabase confirmation and recovery delivery remains pending an owner-created customer account. The new project had no customer users during configuration; the owner was asked to enter their own password through the live registration form.

This configuration does not establish checkout/order receipt delivery. Verify that separately with an authorized test order before claiming it is ready.
