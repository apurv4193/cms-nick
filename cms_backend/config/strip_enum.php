<?php

return [

    /*
    |--------------------------------------------------------------------------
    | STRIP enum 
    |--------------------------------------------------------------------------
    |
    | This file is for match event json type (stripe webhook listener).
    |
    */
    'STRIPE_EVENT_JSON' => [

        'status_inactive' => 0,
        'status_active' => 1,

        'charge_failed' => 'charge.failed',
        'customer_subscription_deleted' => 'customer.subscription.deleted',
        'invoice_created' => 'invoice.created',
        'invoice_payment_succeeded' => 'invoice.payment_succeeded',
        'monthly_interval_name' => 'monthly',
        'yearly_interval_name' => 'yearly',
        'DOWNGRADE_REQUEST' => 'downgrade'

    ],

    ];
?>