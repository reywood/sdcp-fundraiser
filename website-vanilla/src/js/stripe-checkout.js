$(() => {
    stripeCheckoutResponse.handleCheckoutSuccessOrCancel();
});

const stripeCheckoutSession = ({ selectedPrice, quantity, buyerName, attendeeType, ticketInHonorOf }) => {
    return {
        checkout() {
            return this.requestSessionId().then(sessionId => {
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
                            throw new Error(`Request failed: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(responseJson => {
                        resolve(responseJson.sessionId);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },

        redirectToCheckout(sessionId) {
            const stripe = new Stripe(config.stripeKey);
            stripe.redirectToCheckout({ sessionId });
        },

        buildSessionRequestBody() {
            const baseReturnUrl = `${location.protocol}//${location.host}${location.pathname}`;
            return JSON.stringify({
                environment: config.environment,
                buyerName: buyerName,
                ticketAmount: selectedPrice,
                quantity: quantity,
                attendeeType: attendeeType,
                inHonorOf: ticketInHonorOf,
                successUrl: `${baseReturnUrl}?checkout-status=success&price=${selectedPrice}&quantity=${quantity}`,
                cancelUrl: `${baseReturnUrl}?checkout-status=cancel`
            });
        },
    }
}


const stripeCheckoutResponse = {
    handleCheckoutSuccessOrCancel() {
        const searchParams = new URLSearchParams(window.location.search);
        const chargeStatus = searchParams.get('checkout-status');
        if (chargeStatus === 'success') {
            this.showCheckoutSuccessMessage();
            this.logSuccessfulCheckout(searchParams);
        }
        if (chargeStatus === 'cancel') {
            this.logCancelledCheckout();
        }
    },

    showCheckoutSuccessMessage() {
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
    },

    logSuccessfulCheckout(searchParams) {
        const price = searchParams.get('price');
        const quantity = searchParams.get('quantity');
        if (price && quantity) {
            const total = parseInt(price, 10) * parseInt(quantity, 10);
            gtag && gtag('event', 'Ticket purchase successful', { value: total });
        }
    },

    logCancelledCheckout() {
        gtag && gtag('event', 'Cancel checkout');
    }
};
