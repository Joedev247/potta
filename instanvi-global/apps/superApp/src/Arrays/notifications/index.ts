

export const Orders = [
    { Label: 'Order Confirmation', description: 'Sent automatically to the customer after they place their order' },
    { Label: 'Order Edited', description: 'Sent to the customer after their order is edited (if select this option)' },
    { Label: 'Order invoice', description: ' Send to the customers when the order is has an oustanding balances' },
    { Label: 'Order cancelled', description: 'Send Automatically to the customer if their order is cancelled (if you select this option)' },
    { Label: 'Order Refund', description: 'Send Automatically to the customer if their order is refunded (if you select this option)' },
    { Label: 'Payment Error', description: 'Send Automatically to the customer if the payment can"t be processed during checkout' },
]


export const Shipping = [
    { Label: 'Fufillment Request', description: 'Sent automatically to a third-party fulfillment service provider ' },
    { Label: 'Shipping Confirmation', description: 'Sent automatically to the customer when order items are fulfilled(if you select this option)' },
    { Label: 'Order Confirmation', description: 'Sent automatically to the customer if their fulfilled  order"s tracking number is updated' },
]


export const Delivery = [
    { Label: 'Local order out for deliver', description: 'Sent to the customer when their local order is out for delivery' },
    { Label: 'Local order delivered', description: 'Sent  to the customer when their local order is delivered' },
    { Label: 'Local order missed delivery', description: ' ' },
]