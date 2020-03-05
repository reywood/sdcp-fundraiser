$(() => {
    const checkoutBtn = createCheckoutButton();
    handleCheckoutSuccessOrCancel();

    // toggleCheckoutButton(checkoutBtn);
    // onFormInputChange(() => {
    //     toggleCheckoutButton(checkoutBtn);
    // });
});

function handleCheckoutSuccessOrCancel() {
    const searchParams = new URLSearchParams(window.location.search);
    const chargeStatus = searchParams.get('charge-status');
    if (chargeStatus === 'success') {
        showCheckoutSuccessMessage();
        logSuccessfulCheckout(searchParams);
    }
    if (chargeStatus === 'cancel') {
        logCancelledCheckout();
    }
}

function showCheckoutSuccessMessage() {
    const $alert = $(`
        <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
            <h4 class="alert-heading">Thank you!</h4>
            Your payment has been received. We'll see you at the gala!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);
    $alert.alert();
    $('.alert-container').append($alert);
    setTimeout(() => {
        $alert.alert('close');
    }, 10000);
}

function logSuccessfulCheckout(searchParams) {
    const price = searchParams.get('price');
    const quantity = searchParams.get('quantity');
    if (price && quantity) {
        const total = parseInt(price, 10) * parseInt(quantity, 10);
        gtag && gtag('event', 'Purchase tickets', {value: total});
    }
}

function logCancelledCheckout() {
    gtag && gtag('event', 'Cancel checkout');
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

    return checkoutBtn;
}

function logCheckoutButtonClickEvent() {
    try {
        validate();
        gtag && gtag('event', 'Checkout');
    } catch (error) {
        gtag && gtag('event', 'Fail form validation', {category: 'error', label: error.message});
    }
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
    const stripe = new Stripe('pk_test_f2pBW8S36KI3jielImS2Odg2', {
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
        buyerName: getBuyerName(),
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

function getTicketInHonorOf() {
    const isActive = $('.form-group-in-honor-of').hasClass('active');
    return isActive ? $('#ticket-in-honor-of').val() : '';
}

function getAttendeeType() {
    return $('input[name="attendee-type"]:checked').val();
}
