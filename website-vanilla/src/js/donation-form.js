$(() => {
    donationForm.init({
        checkoutHandler: ({ amount, donorName, ticketInHonorOf }) => {
            stripeDonateSession({ amount, donorName, ticketInHonorOf }).checkout()
        }
    });
});

const donationForm = {
    init({ checkoutHandler }) {
        document.getElementById('donation-form').addEventListener('submit', e => {
            e.preventDefault();
            this.handleSubmit(() => checkoutHandler({
                amount: this.getAmount(),
                donorName: this.getDonorName(),
                ticketInHonorOf: this.getTicketInHonorOf(),
            }));
        });
    },

    handleSubmit(checkoutHandler) {
        const donateBtn = document.querySelector('#donate-button button');
        const donateBtnOriginalText = donateBtn.textContent;
        donateBtn.disabled = true;
        this.toggleValidationMessage();

        if (this.doAllFieldsPassValidation()) {
            this.showCheckingOutIndicator(donateBtn);
            this.logDonateButtonClickEvent();
            checkoutHandler().catch(error => {
                console.log(error);
                alert('Unable to process donation. Please try again.');
                if (this.checkingOutInterval) {
                    clearInterval(this.checkingOutInterval);
                    this.checkingOutInterval = null;
                }
                donateBtn.textContent = donateBtnOriginalText;
                donateBtn.disabled = false;
            });
        } else {
            donateBtn.disabled = false;
            if (!this.isFormInputChangeValidationHandlerAttached) {
                this.onFormInputChange(() => this.toggleValidationMessage());
                this.isFormInputChangeValidationHandlerAttached = true;
            }
        }
    },

    showCheckingOutIndicator(donateBtn) {
        let counter = 0;
        this.checkingOutInterval = setInterval(() => {
            const ellipsis = [...Array(counter)].map(() => '.').join('');
            const text = `Processing ${ellipsis}`;
            counter = ++counter % 4;
            donateBtn.textContent = text;
        }, 500);
    },

    logDonateButtonClickEvent() {
        try {
            validate();
            gtag && gtag('event', 'Donation checkout');
        } catch (error) {
            gtag && gtag('event', 'Fail donation form validation', { category: 'error', label: error.message });
        }
    },

    toggleValidationMessage() {
        if (this.doAllFieldsPassValidation()) {
            $('.donation-validation-error').hide();
        } else {
            $('.donation-validation-error').show();
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

    validate() {
        const integerRegex = /^[0-9]+$/;

        const donorName = this.getDonorName();
        if (!donorName || donorName.length <= 0) {
            throw new FormValidationError('Please enter your name');
        }

        const amount = this.getAmount();
        if (!integerRegex.test(amount)) {
            throw new FormValidationError('Enter a valid donation amount');
        }
    },

    onFormInputChange(handler) {
        $('.donate-container input').on('change', handler);
        $('.donate-container input[type="text"], .donate-container input[type="number"]').on('input', handler);
    },

    getDonorName() {
        return $('#donation-donor-name').val();
    },

    getAmount() {
        return $('#donation-amount').val();
    },

    getTicketInHonorOf() {
        return $('#donation-in-honor-of').val();
    },

    FormValidationError: class FormValidationError extends Error {
        constructor(message) {
            super(message);
        }
    }
};
