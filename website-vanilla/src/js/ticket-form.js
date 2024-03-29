$(() => {
    ticketForm.init({
        checkoutHandler:
            ({ selectedPrice, quantity, buyerName, attendeeType, ticketInHonorOf, ccFeeOffset }) => {
                return stripeCheckoutSession({
                    selectedPrice,
                    quantity,
                    buyerName,
                    attendeeType,
                    ticketInHonorOf,
                    ccFeeOffset,
                }).checkout();
            }
    });
});

const ticketForm = {
    init({ checkoutHandler }) {
        document.getElementById('ticket-purchase-form').addEventListener('submit', e => {
            e.preventDefault();
            this.handleSubmit(() => checkoutHandler({
                selectedPrice: this.getSelectedPrice(),
                quantity: this.getQuantity(),
                buyerName: this.getBuyerName(),
                attendeeType: this.getAttendeeType(),
                ticketInHonorOf: this.getTicketInHonorOf(),
                ccFeeOffset: this.getCcFeeOffset(),
            }));
        });

        this.showAppropriateContent();
        this.bindToggleInHonorOfOnAttendeeTypeChange();
        this.toggleInHonorOf();
        // $('.purchase-container form .form-check').css('color', 'red');
    },

    showAppropriateContent() {
        const now = new Date();
        if (now < config.saleStartDate) {
            document.querySelector('.ticket-sale-start-date').textContent = moment(config.saleStartDate).format(
                'MMMM Do'
            );
            document.querySelector('.purchase-check-back').style.display = 'block';
        } else if (now > config.saleEndDate) {
            document.querySelector('.purchase-after-event').style.display = 'block';
        } else {
            document.querySelector('#ticket-purchase-form').style.display = 'block';
            this.showEarlyBirdOfferIfApplicable();
        }
    },

    showEarlyBirdOfferIfApplicable() {
        const earlyBirdSales = getEarlyBirdSales();
        const now = new Date();
        for (const saleInfo of earlyBirdSales) {
            if (now >= saleInfo.startDate && now <= saleInfo.endDate) {
                const container = document.querySelector('.purchase-early-bird');
                const offerDetailElement = container.querySelector('.early-bird-offer');
                const detail = `${saleInfo.bonusRaffleTickets} extra raffle ${this.pluralize(
                    saleInfo.bonusRaffleTickets,
                    'ticket'
                )}`;
                offerDetailElement.textContent = detail;
                container.style.display = 'block';

                document
                    .querySelector('.purchase-container-tickets')
                    .classList.add(`early-bird-${saleInfo.bonusRaffleTickets}`);

                break;
            }
        }
    },

    pluralize(qty, noun) {
        if (qty === 1) {
            return noun;
        }
        return `${noun}s`;
    },

    handleSubmit(checkoutHandler) {
        const checkoutBtn = document.querySelector('#payment-button button');
        const checkoutBtnOriginalText = checkoutBtn.textContent;
        checkoutBtn.disabled = true;
        this.toggleValidationMessage();

        if (this.doAllFieldsPassValidation()) {
            this.showCheckingOutIndicator(checkoutBtn);
            this.logCheckoutButtonClickEvent();
            checkoutHandler().catch(error => {
                console.log(error);
                alert('Unable to process checkout. Please try again.');
                if (this.checkingOutInterval) {
                    clearInterval(this.checkingOutInterval);
                    this.checkingOutInterval = null;
                }
                checkoutBtn.textContent = checkoutBtnOriginalText;
                checkoutBtn.disabled = false;
            });
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
        this.checkingOutInterval = setInterval(() => {
            const ellipsis = [...Array(counter)].map(() => '.').join('');
            const text = `Processing ${ellipsis}`;
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
            gtag && gtag('event', 'Ticket checkout');
        } catch (error) {
            gtag && gtag('event', 'Fail checkout form validation', { category: 'error', label: error.message });
        }
    },

    validate() {
        const integerRegex = /^[0-9]+$/;

        const buyerName = this.getBuyerName();
        if (!buyerName || buyerName.length <= 0) {
            throw new this.FormValidationError('Please enter your name');
        }

        const price = this.getSelectedPrice();
        if (!integerRegex.test(price)) {
            throw new this.FormValidationError('Select a valid price');
        }

        const quantity = this.getQuantity();
        if (!integerRegex.test(quantity) || parseInt(quantity, 10) <= 0) {
            throw new this.FormValidationError('Select a valid quantity');
        }

        const attendeeType = this.getAttendeeType();
        if (!attendeeType || attendeeType.length <= 0) {
            throw new this.FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
        }
    },

    onFormInputChange(handler) {
        $('.purchase-container input').on('change', handler);
        $('.purchase-container input[type="text"], .purchase-container input[type="number"]').on('input', handler);
    },

    toggleValidationMessage() {
        if (this.doAllFieldsPassValidation()) {
            $('.checkout-validation-error').hide();
        } else {
            $('.checkout-validation-error').show();
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
        // return this.getSelectedPriceRadio().val();
        return $('input[name="ticket-amount"]').val();
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

    getCcFeeOffset() {
        if ($('#ticket-cc-fee-offset').prop('checked')) {
            const total = parseFloat(this.getSelectedPrice()) * parseInt(this.getQuantity(), 10);
            return calculateCreditCardProcessingFee(total);
        }
        return 0;
    },

    getAttendeeType() {
        return $('input[name="attendee-type"]:checked').val();
    },

    FormValidationError: class FormValidationError extends Error {
        constructor(message) {
            super(message);
        }
    }
};
