function getSelectedPrice() {
    alert('FIX THIS');
    let selectedAmount = $('input[name="ticket-amount"]:checked').val();
    if (selectedAmount === 'other') {
        selectedAmount = $('input[name="other-amount"]').val();
    }
    return selectedAmount;
}

$(() => {
    paypal.Button.render({
        env: 'sandbox', // 'sandbox' or 'production'
        client: {
            sandbox: 'AaQRVNv7BECRqF0l5Ew2F4cxn061h8SubfgACiIDe8khVIpmIRG-OKeREjMSXqQwMInoJehvwhk0DhEz',
            production: 'AYYXWikffgqwzhJ3UPmTWEzgBBAU_LH09_ie90W_aJjvmboivxKHjU4TRoFND576csELUppEN2-w9pXz',
        },
        style: {
            size: 'responsive',
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
});
