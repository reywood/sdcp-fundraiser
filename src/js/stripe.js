$(() => {
    handleCheckoutSuccessOrCancel();
});

const stripeCheckout = {
    checkout() {
        this.requestSessionId().then(sessionId => {
            this.redirectToCheckout(sessionId);
        });
    },

    requestSessionId() {
        const url = 'https://api.sdcpfundraiser.org/default/sdcp-ticket-order';
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                mode: 'cors',
                body: this.buildSessionRequestBody()
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
    },

    redirectToCheckout(sessionId) {
        const stripe = new Stripe('pk_test_f2pBW8S36KI3jielImS2Odg2'); // , {
        //     stripeAccount: 'acct_1E2m0vASc7ERbwvp'
        // });
        stripe.redirectToCheckout({sessionId});
    },

    buildSessionRequestBody() {
        const baseReturnUrl = `${location.protocol}//${location.host}${location.pathname}`;
        const price = ticketForm.getSelectedPrice();
        const quantity = ticketForm.getQuantity();
        return JSON.stringify({
            buyerName: ticketForm.getBuyerName(),
            ticketAmount: price,
            quantity: quantity,
            attendeeType: ticketForm.getAttendeeType(),
            inHonorOf: ticketForm.getTicketInHonorOf(),
            successUrl: `${baseReturnUrl}?checkout-status=success&price=${price}&quantity=${quantity}`,
            cancelUrl: `${baseReturnUrl}?checkout-status=cancel`
        });
    }
};

function handleCheckoutSuccessOrCancel() {
    const searchParams = new URLSearchParams(window.location.search);
    const chargeStatus = searchParams.get('checkout-status');
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
