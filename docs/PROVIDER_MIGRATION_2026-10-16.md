# Peptalith provider migration

Production project: Vercel `software333/rebrand`, domain `https://www.peptalith.com`.

## Configured

- Replaced the disconnected Supabase integration with the new `peptalith` project (`hagxypbaoffixzuigkbq`). The previous resource was disconnected, not deleted.
- Applied all seven repository migrations to the initially empty database. Verified 13 public tables, all with row-level security, and no anonymous profile access.
- Ran the transactional customer order-history test: contents, pagination, verified ownership, suspension, and private access. Test data was rolled back.
- Set the production site URL and exact callback/reset redirects. Enabled email confirmations, secure email/password changes, and a 12-character minimum password.
- Connected a Managed Cloudflare Turnstile widget for `peptalith.com` to Supabase Auth and Vercel. Pre-clearance is disabled.
- Stored the database server key, Turnstile secret, and cron secret as production-only Vercel Secrets. Only publishable configuration uses `VITE_*` names.
- Removed Stripe/WooCommerce configuration requirements from database-only account and tracking handlers.
- October 17: configured Resend SMTP and website enquiry delivery from `info@peptalith.com`; see [email setup](EMAIL_SETUP_2026-10-17.md).

## Saved for later

- Full account confirmation/recovery testing needs a customer account created by its owner. SMTP is configured; the owner must enter their own new password.
- Order receipt delivery still needs a separate checkout-flow test; website enquiry delivery has been verified in the receiving inbox.
- The Supabase Free plan does not provide the documented server-side session timebox/inactivity controls. No paid upgrade was made.
- Product logistics approvals remain outstanding; approving SKU identifiers did not approve weights or package dimensions.

No credentials are recorded in this document.
