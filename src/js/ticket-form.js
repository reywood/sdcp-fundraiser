$(() => {
    $('input[name="attendee-type"]').on('change', e => {
        const checkbox = e.target;
        if (checkbox.id === 'attendee-type-friend' && checkbox.checked) {
            $('.form-group-in-honor-of').addClass('active');
        } else {
            $('.form-group-in-honor-of').removeClass('active');
        }
    });
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
