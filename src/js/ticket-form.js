$(() => {
    ticketForm.init(() => stripeCheckout.checkout());
});

const ticketForm = {
    init(checkoutHandler) {
        this.createCheckoutButton(checkoutHandler);
        this.bindToggleInHonorOfOnAttendeeTypeChange();
        this.toggleInHonorOf();
        // $('.purchase-container form .form-check').css('color', 'red');
    },

    createCheckoutButton(checkoutHandler) {
        const checkoutBtn = document.createElement('button');
        checkoutBtn.classList.add('btn');
        checkoutBtn.classList.add('btn-success');
        checkoutBtn.textContent = 'Checkout';
        checkoutBtn.addEventListener('click', () => this.handleCheckoutButtonClick(checkoutBtn));

        document.getElementById('payment-button').appendChild(checkoutBtn);

        return checkoutBtn;
    },

    handleCheckoutButtonClick(checkoutBtn) {
        checkoutBtn.disabled = true;
        this.toggleValidationMessage();

        if (this.doAllFieldsPassValidation()) {
            this.showCheckingOutIndicator(checkoutBtn);
            this.logCheckoutButtonClickEvent();
            checkoutHandler();
        } else {
            checkoutBtn.disabled = false;
            if (!this.isFormInputChangeValidationHandlerAttached) {
                this.onFormInputChange(() => this.toggleValidationMessage());
                this.isFormInputChangeValidationHandlerAttached = true;
            }
        }
    },

    showCheckingOutIndicator(checkoutBtn) {
        let counter = 0;
        setInterval(() => {
            const ellipsis = [...Array(counter)].map(() => '.').join('');
            const text = `Checking out ${ellipsis}`;
            counter = ++counter % 4;
            checkoutBtn.textContent = text;
        }, 500);
    },

    bindToggleInHonorOfOnAttendeeTypeChange() {
        $('input[name="attendee-type"]').on('change', e => {
            this.toggleInHonorOf();
        });
    },

    toggleInHonorOf() {
        if ($('#attendee-type-friend').prop('checked')) {
            $('.form-group-in-honor-of').addClass('active');
        } else {
            $('.form-group-in-honor-of').removeClass('active');
        }
    },

    logCheckoutButtonClickEvent() {
        try {
            validate();
            gtag && gtag('event', 'Checkout');
        } catch (error) {
            gtag && gtag('event', 'Fail form validation', {category: 'error', label: error.message});
        }
    },

    validate() {
        const integerRegex = /^[0-9]+$/;

        const buyerName = this.getBuyerName();
        if (!buyerName || buyerName.length <= 0) {
            throw new FormValidationError('Please enter your name');
        }

        const price = this.getSelectedPrice();
        if (!integerRegex.test(price)) {
            throw new FormValidationError('Select a valid price');
        }

        const quantity = this.getQuantity();
        if (!integerRegex.test(quantity) || parseInt(quantity, 10) <= 0) {
            throw new FormValidationError('Select a valid quantity');
        }

        const attendeeType = this.getAttendeeType();
        if (!attendeeType || attendeeType.length <= 0) {
            throw new FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
        }
    },

    onFormInputChange(handler) {
        $('.purchase-container input').on('change', handler);
        $('.purchase-container input[type="text"]').on('input', handler);
    },

    toggleValidationMessage() {
        if (this.doAllFieldsPassValidation()) {
            $('.validation-error').hide();
        } else {
            $('.validation-error').show();
        }
    },

    doAllFieldsPassValidation() {
        try {
            this.validate();
            return true;
        } catch (error) {
            return false;
        }
    },

    getBuyerName() {
        return $('#ticket-buyer-name').val();
    },

    getSelectedPrice() {
        let selectedAmount = this.getSelectedPriceRadio().val();
        if (selectedAmount === 'other') {
            selectedAmount = $('input[name="other-amount"]').val();
        }
        return selectedAmount;
    },

    getSelectedPriceRadio() {
        return $('input[name="ticket-amount"]:checked');
    },

    getQuantity() {
        return $('#ticket-quantity').val();
    },

    getTicketInHonorOf() {
        const isActive = $('.form-group-in-honor-of').hasClass('active');
        return isActive ? $('#ticket-in-honor-of').val() : '';
    },

    getAttendeeType() {
        return $('input[name="attendee-type"]:checked').val();
    }
};

class FormValidationError extends Error {
    constructor(message) {
        super(message);
    }
}
