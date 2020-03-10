$(() => {
    stripeDonate.handleDonationSuccessOrCancel();
});

const stripeDonate = {
    checkout() {
        return this.requestSessionId().then(sessionId => {
            this.redirectToCheckout(sessionId);
        });
    },

    requestSessionId() {
        const url = 'https://api.sdcpfundraiser.org/default/sdcp-donate';
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
                    reject(error);
                });
        });
    },

    redirectToCheckout(sessionId) {
        const stripe = new Stripe(config.stripeKey);
        stripe.redirectToCheckout({sessionId});
    },

    buildSessionRequestBody() {
        const baseReturnUrl = `${location.protocol}//${location.host}${location.pathname}`;
        const amount = donationForm.getAmount();
        return JSON.stringify({
            donorName: donationForm.getDonorName(),
            amount: amount,
            inHonorOf: donationForm.getTicketInHonorOf(),
            successUrl: `${baseReturnUrl}?donation-status=success&amount=${amount}`,
            cancelUrl: `${baseReturnUrl}?donation-status=cancel`
        });
    },

    handleDonationSuccessOrCancel() {
        const searchParams = new URLSearchParams(window.location.search);
        const donationStatus = searchParams.get('donation-status');
        if (donationStatus === 'success') {
            this.showDonationSuccessMessage();
            this.logSuccessfulDonation(searchParams);
        }
        if (donationStatus === 'cancel') {
            this.logCancelledDonation();
        }
    },

    showDonationSuccessMessage() {
        const $alert = $(`
        <div class="alert alert-success alert-dismissible fade show text-center" role="alert">
            <h4 class="alert-heading">Thank you!</h4>
            Your donation has been received. Your support is greatly appreciated!
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

    logSuccessfulDonation(searchParams) {
        const amount = searchParams.get('amount');
        if (amount) {
            gtag && gtag('event', 'Donation successful', {value: parseInt(amount, 10)});
        }
    },

    logCancelledDonation() {
        gtag && gtag('event', 'Cancel donation');
    }
};
