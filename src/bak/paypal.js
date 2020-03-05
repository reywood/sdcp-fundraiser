$(() => {
    $('input[name="attendee-type"]').on('change', (e) => {
        const checkbox = e.target;
        if (checkbox.id === 'attendee-type-friend' && checkbox.checked) {
            $('.form-group-in-honor-of').addClass('active');
        } else {
            $('.form-group-in-honor-of').removeClass('active');
        }
    });

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
            logCheckoutButtonClickEvent();
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

                const price = parseInt(getSelectedPrice(), 10);
                const quantity = parseInt(getQuantity(), 10);
                const total = price * quantity;
                gtag && gtag('event', 'Purchase tickets', {value: total});
            });
        },
        onCancel(data, actions) {
            gtag && gtag('event', 'Cancel checkout');
        },
        onError(err) {
            // This doesn't work
            // if (err instanceof FormValidationError) {
            //     $('.validation-error').show();
            // }
        },
    }, '#payment-button');
});

class FormValidationError extends Error {
    constructor(message) {
        super(message);
    }
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

function onFormInputChange(handler) {
    $('.purchase-container input').on('change', handler);
}

function togglePaypalButton(actions) {
    if (doAllFieldsPassValidation()) {
        actions.enable();
    } else {
        actions.disable();
    }
}

function toggleValidationMessage() {
    if (doAllFieldsPassValidation()) {
        $('.validation-error').hide();
    } else {
        $('.validation-error').show();
    }
}

function logCheckoutButtonClickEvent() {
    try {
        validate();
        gtag && gtag('event', 'Checkout');
    } catch (error) {
        gtag && gtag('event', 'Fail form validation', {category: 'error', label: error.message});
    }
}

function doAllFieldsPassValidation() {
    try {
        validate();
        return true;
    } catch (error) {
        return false;
    }
}

function getSelectedPrice() {
    let selectedAmount = getSelectedPriceRadio().val();
    if (selectedAmount === 'other') {
        selectedAmount = $('input[name="other-amount"]').val();
    }
    return selectedAmount;
}

function getSelectedPriceRadio() {
    return $('input[name="ticket-amount"]:checked');
}

function getQuantity() {
    return $('#ticket-quantity').val();
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
    const inHonorOf = getTicketInHonorOf();
    if (inHonorOf) {
        itemNameParts.push(`(${attendeeType}, in honor of ${inHonorOf})`);
    } else {
        itemNameParts.push(`(${attendeeType})`);
    }

    return itemNameParts.join(' ');
}

function getTicketInHonorOf() {
    const isActive = $('.form-group-in-honor-of').hasClass('active');
    return isActive ? $('#ticket-in-honor-of').val() : '';
}

function getAttendeeType() {
    return $('input[name="attendee-type"]:checked').val();
}

function getExtras() {
    return getSelectedPriceRadio().data('extras');
}
