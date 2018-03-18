'use strict';

$('#buy-tickets-button').click(function (e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: $('#buy-tickets').offset().top
    }, 500);
});
'use strict';

function getSelectedPrice() {
    alert('FIX THIS');
    return 50;
}

paypal.Button.render({
    env: 'sandbox',
    client: {
        sandbox: 'AaQRVNv7BECRqF0l5Ew2F4cxn061h8SubfgACiIDe8khVIpmIRG-OKeREjMSXqQwMInoJehvwhk0DhEz'
    },
    style: {
        size: 'medium',
        label: 'pay',
        tagline: false
    },
    payment: function payment(data, actions) {
        var price = getSelectedPrice();
        var quantity = parseInt($('#ticket-quantity').val(), 10);
        var total = price * quantity;

        return actions.payment.create({
            payment: {
                transactions: [{
                    amount: { total: total, currency: 'USD' },
                    item_list: {
                        items: [{
                            name: 'Gala ticket',
                            quantity: quantity.toString(),
                            price: price.toString(),
                            currency: 'USD'
                        }]
                    }
                }]
            }
        });
    },
    onAuthorize: function onAuthorize(data, actions) {
        return actions.payment.execute().then(function (payment) {
            // The payment is complete!
            // You can now show a confirmation message to the customer
            alert('Thank you!');
        });
    },
    onCancel: function onCancel(data, actions) {},
    onError: function onError(err) {}
}, '#paypal-button');
'use strict';

var eventDate = new Date('2018-05-18T18:00:00-0700');

setInterval(function () {
    var _timeLeft = timeLeft(),
        days = _timeLeft.days,
        hours = _timeLeft.hours,
        minutes = _timeLeft.minutes,
        seconds = _timeLeft.seconds;

    var pluralize = function pluralize(number, label) {
        if (number === 1) {
            return number + ' ' + label;
        }
        return number + ' ' + label + 's';
    };

    if (days + hours + minutes + seconds > 0) {
        $('.time-left').html('\n            ' + pluralize(days, 'day') + ' &nbsp;&nbsp;\n            ' + pluralize(hours, 'hour') + ' &nbsp;&nbsp;\n            ' + pluralize(minutes, 'minute') + ' &nbsp;&nbsp;\n            ' + pluralize(seconds, 'second') + '\n        ');
    }
}, 1000);

function timeLeft() {
    var now = new Date();
    var secondsLeft = (eventDate.getTime() - now.getTime()) / 1000;
    var daysLeft = Math.floor(secondsLeft / 60 / 60 / 24);
    var hoursLeft = Math.floor(secondsLeft / 60 / 60) % 24;
    var minutesLeft = Math.floor(secondsLeft / 60) % 60;

    return {
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: Math.floor(secondsLeft % 60)
    };
}
