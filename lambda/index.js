const apiKey = process.env.API_KEY;
const stripe = require('stripe')(apiKey, {
    apiVersion: '2019-12-03',
    maxNetworkRetries: 1
});

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

const earlyBirdSales = {
    sales: [
        {
            startDate: new Date('2020-03-13T00:00:00-0700'),
            endDate: new Date('2020-03-27T23:59:59-0700'),
            bonusRaffleTickets: 2
        },
        {
            startDate: new Date('2020-03-28T00:00:00-0700'),
            endDate: new Date('2020-04-10T23:59:59-0700'),
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
    const queryArgs = JSON.parse(event.body);
    const ticketAmountInDollars = parseInt(queryArgs.ticketAmount, 10);
    const quantity = parseInt(queryArgs.quantity, 10);
    const attendeeType = queryArgs.attendeeType;
    const inHonorOf = queryArgs.inHonorOf;
    const successUrl = queryArgs.successUrl;
    const cancelUrl = queryArgs.cancelUrl;

    try {
        validate(ticketAmountInDollars, quantity, attendeeType, inHonorOf);
        const extras = getExtras(ticketAmountInDollars);
        const itemName = buildItemName(extras, attendeeType, inHonorOf);

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
                    'attendee type': attendeeType,
                    extras: extras,
                    'in honor of': inHonorOf
                }
            }
        });

        const response = {
            statusCode: 200,
            body: JSON.stringify({sessionId: session.id, itemName})
        };
        return response;
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify('An error occurred. Please try again.\n' + error)
        };
    }
};

function validate(ticketAmountInDollars, quantity, attendeeType, inHonorOf) {
    if (!VALID_TICKET_AMOUNTS.includes(ticketAmountInDollars)) {
        throw new Error('Invalid ticket amount');
    }
    if (isNaN(quantity) || quantity <= 0 || quantity > 100) {
        throw new Error('Invalid quantity');
    }
    if (!VALID_ATTENDEE_TYPES.includes(attendeeType)) {
        throw new Error('Invalid attendee type');
    }
    if (inHonorOf.length > 50) {
        throw new Error('Invalid in honor of');
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
    if (!attendeeType) {
        throw new Error('Please specifiy whether you are currently enrolled, an alum, etc');
    }
    if (inHonorOf) {
        itemNameParts.push(`(${attendeeType}, in honor of ${inHonorOf})`);
    } else {
        itemNameParts.push(`(${attendeeType})`);
    }

    return itemNameParts.join(' ');
}
