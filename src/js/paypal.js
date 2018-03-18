function getSelectedPrice() {
    alert('FIX THIS');
    return 50;
}

paypal.Button.render({
    env: 'sandbox',
    client: {
        sandbox: 'AaQRVNv7BECRqF0l5Ew2F4cxn061h8SubfgACiIDe8khVIpmIRG-OKeREjMSXqQwMInoJehvwhk0DhEz',
    },
    style: {
        size: 'medium',
        label: 'pay',
        tagline: false,
    },
    payment(data, actions) {
        const price = getSelectedPrice();
        const quantity = parseInt($('#ticket-quantity').val(), 10);
        const total = price * quantity;

        return actions.payment.create({
            payment: {
                transactions: [
                    {
                        amount: {total: total, currency: 'USD'},
                        item_list: {
                            items: [
                                {
                                    name: 'Gala ticket',
                                    quantity: quantity.toString(),
                                    price: price.toString(),
                                    currency: 'USD',
                                },
                            ],
                        },
                    },
                ],
            },
        });
    },
    onAuthorize(data, actions) {
        return actions.payment.execute().then(function(payment) {
            // The payment is complete!
            // You can now show a confirmation message to the customer
            alert('Thank you!');
        });
    },
    onCancel(data, actions) {
    },
    onError(err) {
    },
}, '#paypal-button');
