const moment = require('moment');
const Stripe = require('stripe');

const ticketOptions = [
    {
        amount: 50,
        includedRaffleTickets: 0
    },
    {
        amount: 75,
        includedRaffleTickets: 4
    },
    {
        amount: 100,
        includedRaffleTickets: 10
    }
];

const saleStartDate = moment('2020-03-13T00:00:00-07:00', moment.ISO_8601).toDate();
const earlyBirdSales = {
    sales: [
        {
            startDate: saleStartDate,
            endDate: moment(saleStartDate)
                .add(2, 'weeks')
                .toDate(),
            bonusRaffleTickets: 2
        },
        {
            startDate: moment(saleStartDate)
                .add(2, 'weeks')
                .add(1, 'second')
                .toDate(),
            endDate: moment(saleStartDate)
                .add(4, 'weeks')
                .toDate(),
            bonusRaffleTickets: 1
        }
    ],
    getActive() {
        for (const sale of this.sales) {
            if (this.isActive(sale)) {
                return sale;
            }
        }
    },
    isActive(sale) {
        const now = new Date();
        return now >= sale.startDate && now <= sale.endDate;
    }
};

const VALID_TICKET_AMOUNTS = ticketOptions.reduce((amounts, option) => {
    amounts.push(option.amount);
    return amounts;
}, []);
const VALID_ATTENDEE_TYPES = ['current family', 'alum', 'new family', 'grandparent / special friend'];

exports.handler = async event => {
    const now = new Date();
    if (now < saleStartDate) {
        return createResponse(403, 'Tickets are not yet for sale');
    }

    let queryArgs;
    try {
        queryArgs = JSON.parse(event.body);
    } catch (error) {
        return createResponse(400, 'Invalid request body');
    }

    const buyerName = queryArgs.buyerName;
    const ticketAmountInDollars = parseInt(queryArgs.ticketAmount, 10);
    const quantity = parseInt(queryArgs.quantity, 10);
    const attendeeType = queryArgs.attendeeType;
    const inHonorOf = queryArgs.inHonorOf;
    const successUrl = queryArgs.successUrl;
    const cancelUrl = queryArgs.cancelUrl;

    try {
        validate(buyerName, ticketAmountInDollars, quantity, attendeeType, inHonorOf);
        const extras = getExtras(ticketAmountInDollars);
        const itemName = buildItemName(extras, attendeeType, inHonorOf);

        const stripe = Stripe(getApiKey(queryArgs.environment), {
            apiVersion: '2019-12-03',
            maxNetworkRetries: 3
        });
        const session = await stripe.checkout.sessions.create({
            success_url: successUrl,
            cancel_url: cancelUrl,
            payment_method_types: ['card'],
            mode: 'payment',
            submit_type: 'pay',
            line_items: [
                {
                    name: itemName,
                    // description: 'Comfortable cotton t-shirt',
                    amount: ticketAmountInDollars * 100,
                    currency: 'usd',
                    quantity: quantity
                }
            ],
            payment_intent_data: {
                metadata: {
                    name: buyerName,
                    'attendee type': attendeeType,
                    extras: extras,
                    'in honor of': inHonorOf
                }
            }
        });

        return createResponse(200, {sessionId: session.id, itemName});
    } catch (error) {
        return createResponse(500, 'An error occurred. Please try again.\n' + error);
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

function createResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body)
    };
}

function validate(buyerName, ticketAmountInDollars, quantity, attendeeType, inHonorOf) {
    validateText(buyerName, 1, 100, 'Invalid name');
    validateText(inHonorOf, 0, 100, 'Invalid in honor of');
    validateEnum(ticketAmountInDollars, VALID_TICKET_AMOUNTS, 'Invalid ticket amount');
    validateEnum(attendeeType, VALID_ATTENDEE_TYPES, 'Invalid attendee type');
    validateNumber(quantity, 1, 100, 'Invalid quantity');
}

function validateText(value, minLength, maxLength, errorMessage) {
    if (typeof value === 'undefined' || value.length < minLength || value.length > maxLength) {
        throw new Error(errorMessage);
    }
}

function validateEnum(value, validValues, errorMessage) {
    if (!validValues.includes(value)) {
        throw new Error(errorMessage);
    }
}

function validateNumber(value, min, max, errorMessage) {
    if (isNaN(value) || value < min || value > max) {
        throw new Error(errorMessage);
    }
}

function getExtras(ticketAmountInDollars) {
    const ticketOption = ticketOptions.filter(option => option.amount === ticketAmountInDollars)[0];
    if (ticketOption.includedRaffleTickets > 0) {
        let raffleTicketQuantity = ticketOption.includedRaffleTickets;
        const activeSale = earlyBirdSales.getActive();
        if (activeSale) {
            raffleTicketQuantity += activeSale.bonusRaffleTickets;
        }
        return `+ ${raffleTicketQuantity} raffle tickets`;
    }
}

function buildItemName(extras, attendeeType, inHonorOf) {
    const itemNameParts = ['Gala ticket'];

    if (extras) {
        itemNameParts.push(extras);
    }
    if (inHonorOf) {
        itemNameParts.push(`(${attendeeType}, in honor of ${inHonorOf})`);
    } else {
        itemNameParts.push(`(${attendeeType})`);
    }

    return itemNameParts.join(' ');
}
