function getSelectedPriceRadio() {
    return $('input[name="ticket-amount"]:checked');
}

function getSelectedPrice() {
    let selectedAmount = getSelectedPriceRadio().val();
    if (selectedAmount === 'other') {
        selectedAmount = $('input[name="other-amount"]').val();
    }
    return selectedAmount;
}

function getQuantity() {
    return $('#ticket-quantity').val();
}

function getExtras() {
    return getSelectedPriceRadio().data('extras');
}

function getAttendeeType() {
    return $('input[name="attendee-type"]:checked').val();
}

function buildItemName() {
    const itemNameParts = ['Gala ticket'];

    const extras = getExtras();
    if (extras) {
        itemNameParts.push(`+ ${extras}`);
    }
    const attendeeType = getAttendeeType();
    if (!attendeeType) {
        throw new FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
    }
    itemNameParts.push(`(${attendeeType})`);

    return itemNameParts.join(' ');
}

function validate() {
    const integerRegex = /^[0-9]+$/;

    const price = getSelectedPrice();
    if (!integerRegex.test(price)) {
        throw new FormValidationError('Select a valid price');
    }

    const quantity = getQuantity();
    if (!integerRegex.test(quantity)) {
        throw new FormValidationError('Select a valid quantity');
    }

    const attendeeType = getAttendeeType();
    if (!attendeeType || attendeeType.length <= 0) {
        throw new FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
    }
}

class FormValidationError extends Error {
    constructor(message) {
        super(message);
    }
}

function onFormInputChange(handler) {
    $('.purchase-container input').on('change', handler);
}

function togglePaypalButton(actions) {
    try {
        validate();
        actions.enable();
    } catch (error) {
        actions.disable();
    }
}

function toggleValidationMessage() {
    try {
        validate();
        $('.validation-error').hide();
    } catch (error) {
        console.log(error);
        $('.validation-error').show();
    }
}


$(() => {
    paypal.Button.render({
        env: 'production', // 'sandbox' or 'production'
        client: {
            sandbox: 'AaQRVNv7BECRqF0l5Ew2F4cxn061h8SubfgACiIDe8khVIpmIRG-OKeREjMSXqQwMInoJehvwhk0DhEz',
            production: 'AYYXWikffgqwzhJ3UPmTWEzgBBAU_LH09_ie90W_aJjvmboivxKHjU4TRoFND576csELUppEN2-w9pXz',
        },
        style: {
            size: 'responsive',
            label: 'pay',
            tagline: false,
        },
        validate(actions) {
            togglePaypalButton(actions);
            onFormInputChange(() => {
                togglePaypalButton(actions);
            });
        },
        onClick() {
            toggleValidationMessage();
        },
        payment(data, actions) {
            const price = parseInt(getSelectedPrice(), 10);
            const quantity = parseInt(getQuantity(), 10);
            const total = price * quantity;

            return actions.payment.create({
                payment: {
                    transactions: [
                        {
                            amount: {total: total, currency: 'USD'},
                            description: 'Tickets for SDCP Fundraiser',
                            item_list: {
                                items: [
                                    {
                                        name: buildItemName(),
                                        quantity: quantity.toString(),
                                        price: price.toString(),
                                        currency: 'USD',
                                    },
                                ],
                            },
                        },
                    ],
                },
                experience: {
                    input_fields: {
                        no_shipping: 1,
                    },
                },
            });
        },
        onAuthorize(data, actions) {
            return actions.payment.execute().then((payment) => {
                // The payment is complete!
                // You can now show a confirmation message to the customer
                $('.validation-error').hide();
                $('.purchase-thank-you').show();
            });
        },
        onCancel(data, actions) {
        },
        onError(err) {
            // This doesn't work
            // if (err instanceof FormValidationError) {
            //     $('.validation-error').show();
            // }
        },
    }, '#paypal-button');
});
