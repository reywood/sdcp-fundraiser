const Stripe = require('stripe');

exports.handler = async (event) => {
    let queryArgs;
    try {
        queryArgs = JSON.parse(event.body);
    } catch (error) {
        console.log("Failed to parse event body", error);
        return {
            statusCode: 400,
            body: JSON.stringify('Invalid request body'),
        };
    }
    const donorName = queryArgs.donorName;
    const donationAmountInDollars = parseFloat(queryArgs.amount);
    const inHonorOf = queryArgs.inHonorOf;
    const successUrl = queryArgs.successUrl;
    const cancelUrl = queryArgs.cancelUrl;

    let ccFeeOffset = 0;
    if (queryArgs.ccFeeOffset) {
        ccFeeOffset = parseFloat(queryArgs.ccFeeOffset);
    }

    try {
        validate(donorName, donationAmountInDollars, inHonorOf);
        const itemName = buildItemName(donorName, inHonorOf);
        let description = `Donation $${donationAmountInDollars}`;
        const lineItems = [
            {
                name: itemName,
                // description: 'Comfortable cotton t-shirt',
                amount: donationAmountInDollars * 100,
                quantity: 1,
                currency: 'usd',
            },
        ];

        if (ccFeeOffset > 0) {
            const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
            description += ` (+ ${currencyFormatter.format(ccFeeOffset)} to offset CC fee)`;
            lineItems.push({
                name: 'Credit card fee offset',
                amount: Math.round(ccFeeOffset * 100),
                currency: 'usd',
                quantity: 1
            });
        }

        const stripe = Stripe(getApiKey(queryArgs.environment), {
            apiVersion: '2019-12-03',
            maxNetworkRetries: 3,
        });
        const session = await stripe.checkout.sessions.create({
            success_url: successUrl,
            cancel_url: cancelUrl,
            payment_method_types: ['card'],
            mode: 'payment',
            submit_type: 'donate',
            billing_address_collection: 'required',
            line_items: lineItems,
            payment_intent_data: {
                description: description,
                metadata: {
                    name: donorName,
                    'in honor of': inHonorOf,
                },
            },
        });

        console.log("Created checkout session " + session.id);
        const response = {
            statusCode: 200,
            body: JSON.stringify({ sessionId: session.id, itemName }),
        };
        return response;
    } catch (error) {
        console.log("Failed to create checkout session", error);
        return {
            statusCode: 500,
            body: JSON.stringify('An error occurred. Please try again.\n' + error),
        };
    }
};

function getApiKey(environment) {
    if (environment === 'dev') {
        return process.env.API_KEY_DEV;
    }
    if (environment === 'prod') {
        return process.env.API_KEY_PROD;
    }
}

function validate(donorName, donationAmountInDollars, inHonorOf) {
    validateText(donorName, 1, 100, 'Invalid donor name');
    validateText(inHonorOf, 0, 100, 'Invalid in honor of');
    validateNumber(donationAmountInDollars, 1, 1000000, 'Invalid donation amount');
}

function validateText(value, minLength, maxLength, errorMessage) {
    if (typeof value === 'undefined' || value.length < minLength || value.length > maxLength) {
        throw new Error(errorMessage);
    }
}

function validateNumber(value, min, max, errorMessage) {
    if (isNaN(value) || value < min || value > max) {
        throw new Error(errorMessage);
    }
}

function buildItemName(donorName, inHonorOf) {
    const itemNameParts = [`Donation from ${donorName}`];

    if (inHonorOf) {
        itemNameParts.push(`, in honor of ${inHonorOf}`);
    }

    return itemNameParts.join('');
}
