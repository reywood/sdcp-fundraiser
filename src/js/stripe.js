$(() => {
    createCheckoutButton();
    handleChargeSuccessOrCancel();

    // toggleCheckoutButton(checkoutBtn);
    // onFormInputChange(() => {
    //     toggleCheckoutButton(checkoutBtn);
    // });
});

function handleChargeSuccessOrCancel() {
    const searchParams = new URLSearchParams(window.location.search);
    const chargeStatus = searchParams.get('charge-status');
    if (chargeStatus === 'success') {
        $('.purchase-thank-you').show();
        const price = searchParams.get('price');
        const quantity = searchParams.get('quantity');
        if (price && quantity) {
            const total = parseInt(price, 10) * parseInt(quantity, 10);
            gtag && gtag('event', 'Purchase tickets', {value: total});
        }
    }
    if (chargeStatus === 'cancel') {
        gtag && gtag('event', 'Cancel checkout');
    }
}

function createCheckoutButton() {
    const checkoutBtn = document.createElement('button');
    checkoutBtn.classList.add('btn');
    checkoutBtn.classList.add('btn-success');
    checkoutBtn.textContent = 'Checkout';
    document.getElementById('payment-button').appendChild(checkoutBtn);

    checkoutBtn.addEventListener('click', () => {
        toggleValidationMessage();
        logCheckoutButtonClickEvent();

        if (doAllFieldsPassValidation()) {
            checkoutBtn.disabled = true;

            requestSessionId().then(sessionId => {
                redirectToCheckout(sessionId);
            });
        }
    });
}

function requestSessionId() {
    const url = 'https://api.sdcpfundraiser.org/default/sdcp-ticket-order';
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            body: buildSessionRequestBody()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(responseJson => {
                resolve(responseJson.sessionId);
            })
            .catch(error => {
                alert('Unable to process order');
                reject(error);
            });
    });
}

function redirectToCheckout(sessionId) {
    const stripe = Stripe('pk_test_f2pBW8S36KI3jielImS2Odg2', {
        stripeAccount: 'acct_1E2m0vASc7ERbwvp'
    });
    stripe.redirectToCheckout({sessionId});
}

function onFormInputChange(handler) {
    $('.purchase-container input').on('change', handler);
}

function toggleCheckoutButton(checkoutBtn) {
    if (doAllFieldsPassValidation()) {
        checkoutBtn.disabled = false;
    } else {
        checkoutBtn.disabled = true;
    }
}

function buildSessionRequestBody() {
    const baseReturnUrl = `${location.protocol}//${location.host}${location.pathname}`;
    const price = getSelectedPrice();
    const quantity = getQuantity();
    return JSON.stringify({
        ticketAmount: price,
        quantity: quantity,
        attendeeType: getAttendeeType(),
        inHonorOf: getTicketInHonorOf(),
        successUrl: `${baseReturnUrl}?charge-status=success&price=${price}&quantity=${quantity}`,
        cancelUrl: `${baseReturnUrl}?charge-status=cancel`
    });
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
