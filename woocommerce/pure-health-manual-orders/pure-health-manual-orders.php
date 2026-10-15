<?php
/**
 * Plugin Name: Peptalith Manual Orders
 * Description: Manual-payment checkout and store order notifications for Peptalith.
 * Version: 1.0.0
 * Requires Plugins: woocommerce
 */
defined('ABSPATH') || exit;

add_action('before_woocommerce_init', function () {
    if (class_exists('Automattic\\WooCommerce\\Utilities\\FeaturesUtil')) {
        \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
    }
});

// Store notifications always go to the requested business mailbox.
add_filter('woocommerce_email_recipient_new_order', function ($recipient) {
    return 'info@peptalith.com';
});

add_action('plugins_loaded', function () {
    if (!class_exists('WC_Payment_Gateway')) return;

    class PHP_Manual_Payment_Gateway extends WC_Payment_Gateway {
        public function __construct() {
            $this->id = 'php_manual';
            $this->has_fields = false;
            $this->method_title = 'Peptalith manual payment';
            $this->method_description = 'Accept an order request and contact the customer to arrange payment.';
            $this->title = 'Arrange payment with our team';
            $this->description = 'Submit your order and delivery details. Our team will contact you by email or phone to finalize payment.';
            $this->enabled = 'yes';
            $this->supports = ['products'];
            add_action('woocommerce_thankyou_' . $this->id, [$this, 'instructions']);
            add_action('woocommerce_email_before_order_table', [$this, 'email_instructions'], 10, 3);
        }

        public function process_payment($order_id) {
            $order = wc_get_order($order_id);
            if (!$order) return ['result' => 'failure'];
            $order->update_status('on-hold', 'Customer submitted an order request. Staff will arrange payment.');
            if (WC()->cart) WC()->cart->empty_cart();
            return ['result' => 'success', 'redirect' => $this->get_return_url($order)];
        }

        public function instructions() {
            echo '<p>' . esc_html('Our team will contact you by email or phone to finalize payment. Payment and shipment remain pending.') . '</p>';
        }

        public function email_instructions($order, $sent_to_admin, $plain_text) {
            if ($sent_to_admin || $order->get_payment_method() !== $this->id || !$order->has_status('on-hold')) return;
            if ($plain_text) {
                echo "Our team will contact you by email or phone to finalize payment. Payment and shipment remain pending.\n\n";
            } else {
                $this->instructions();
            }
        }
    }

    add_filter('woocommerce_payment_gateways', function ($gateways) {
        $gateways[] = 'PHP_Manual_Payment_Gateway';
        return $gateways;
    });
});
