# Peptalith manual orders

Prepared installation plugin; not installed on a live store yet.

Requires WordPress with WooCommerce on PHP-capable hosting. The existing Vercel React app remains the storefront; WordPress can run on a dedicated store subdomain once hosting and DNS are confirmed.

Install this directory into `wp-content/plugins/` and activate it after WooCommerce. It adds **Arrange payment with our team**, an offline payment method that places orders on hold, and routes new-order notifications to **info@peptalith.com**. It adds pending-payment instructions to customer on-hold emails. Enable both New order and Order on-hold emails in WooCommerce settings; the recipient filter does not enable disabled notifications.

Before connecting the React app:

1. Verify HTTPS, the business/store address, USD currency, US delivery rules, shipping prices, and catalog imports. The current catalog contains IDs from a previous store; map products/variants to IDs in the new store rather than assuming IDs match.
2. Verify the host's authenticated email sending or connect an external email service. Zoho can continue receiving business mail without supplying SMTP credentials. Send and check a store notification and customer receipt in the actual inboxes.
3. Connect the server-side order endpoint to WooCommerce using protected REST credentials or the existing signed bridge extended for manual requests. Create orders with billing/contact and shipping details, server-priced items, payment method `php_manual`, and status `on-hold`; never set paid on submission. Preserve submission-ID idempotency before retrying order creation.
4. Switch the order backend only after the integration is tested. Disable the app's SMTP email jobs for WooCommerce-backed requests to prevent duplicate notifications. WooCommerce becomes the order authority; the current Supabase manual-request flow remains unchanged until that cutover is ready.
5. Confirm a complete request reaches WooCommerce Orders and both inboxes, remains on hold, and contains the full address/contact information. Staff mark payment complete only after payment is confirmed.

This classic WooCommerce checkout payment gateway is intended for the existing React storefront/server integration. It does not implement a WooCommerce Checkout Blocks payment integration.
