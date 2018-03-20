'use strict';

$(function () {
    $('#buy-tickets-link, #donate-link').click(function (e) {
        e.preventDefault();

        var $linkToElement = $($(e.target).attr('href'));
        $('html, body').animate({ scrollTop: $linkToElement.offset().top }, 500);
    });

    $('input[name="other-amount"]').on('input', function (e) {
        $('#ticket-amount-other').prop('checked', true);
    });
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getSelectedPriceRadio() {
    return $('input[name="ticket-amount"]:checked');
}

function getSelectedPrice() {
    var selectedAmount = getSelectedPriceRadio().val();
    if (selectedAmount === 'other') {
        selectedAmount = $('input[name="other-amount"]').val();
    }
    return selectedAmount;
}

function getQuantity() {
    return $('#ticket-quantity').val();
}

function getExtras() {
    return getSelectedPriceRadio().data('extras');
}

function getAttendeeType() {
    return $('input[name="attendee-type"]:checked').val();
}

function buildItemName() {
    var itemNameParts = ['Gala ticket'];

    var extras = getExtras();
    if (extras) {
        itemNameParts.push('+ ' + extras);
    }
    var attendeeType = getAttendeeType();
    if (!attendeeType) {
        throw new FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
    }
    itemNameParts.push('(' + attendeeType + ')');

    return itemNameParts.join(' ');
}

function validate() {
    var integerRegex = /^[0-9]+$/;

    var price = getSelectedPrice();
    if (!integerRegex.test(price)) {
        throw new FormValidationError('Select a valid price');
    }

    var quantity = getQuantity();
    if (!integerRegex.test(quantity)) {
        throw new FormValidationError('Select a valid quantity');
    }

    var attendeeType = getAttendeeType();
    if (!attendeeType || attendeeType.length <= 0) {
        throw new FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
    }
}

var FormValidationError = function (_Error) {
    _inherits(FormValidationError, _Error);

    function FormValidationError(message) {
        _classCallCheck(this, FormValidationError);

        return _possibleConstructorReturn(this, (FormValidationError.__proto__ || Object.getPrototypeOf(FormValidationError)).call(this, message));
    }

    return FormValidationError;
}(Error);

function onFormInputChange(handler) {
    $('.purchase-container input').on('change', handler);
}

function togglePaypalButton(actions) {
    try {
        validate();
        actions.enable();
    } catch (error) {
        actions.disable();
    }
}

function toggleValidationMessage() {
    try {
        validate();
        $('.validation-error').hide();
    } catch (error) {
        console.log(error);
        $('.validation-error').show();
    }
}

$(function () {
    paypal.Button.render({
        env: 'production', // 'sandbox' or 'production'
        client: {
            sandbox: 'AaQRVNv7BECRqF0l5Ew2F4cxn061h8SubfgACiIDe8khVIpmIRG-OKeREjMSXqQwMInoJehvwhk0DhEz',
            production: 'AYYXWikffgqwzhJ3UPmTWEzgBBAU_LH09_ie90W_aJjvmboivxKHjU4TRoFND576csELUppEN2-w9pXz'
        },
        style: {
            size: 'responsive',
            label: 'pay',
            tagline: false
        },
        validate: function validate(actions) {
            togglePaypalButton(actions);
            onFormInputChange(function () {
                togglePaypalButton(actions);
            });
        },
        onClick: function onClick() {
            toggleValidationMessage();
        },
        payment: function payment(data, actions) {
            var price = parseInt(getSelectedPrice(), 10);
            var quantity = parseInt(getQuantity(), 10);
            var total = price * quantity;

            return actions.payment.create({
                payment: {
                    transactions: [{
                        amount: { total: total, currency: 'USD' },
                        description: 'Tickets for SDCP Fundraiser',
                        item_list: {
                            items: [{
                                name: buildItemName(),
                                quantity: quantity.toString(),
                                price: price.toString(),
                                currency: 'USD'
                            }]
                        }
                    }]
                },
                experience: {
                    input_fields: {
                        no_shipping: 1
                    }
                }
            });
        },
        onAuthorize: function onAuthorize(data, actions) {
            return actions.payment.execute().then(function (payment) {
                // The payment is complete!
                // You can now show a confirmation message to the customer
                $('.validation-error').hide();
                $('.purchase-thank-you').show();
            });
        },
        onCancel: function onCancel(data, actions) {},
        onError: function onError(err) {
            // This doesn't work
            // if (err instanceof FormValidationError) {
            //     $('.validation-error').show();
            // }
        }
    }, '#paypal-button');
});
'use strict';

var eventDate = new Date('2018-05-18T18:00:00-0700');

$(function () {
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
            $('.time-left').html('\n                ' + pluralize(days, 'day') + ' &nbsp;&nbsp;\n                ' + pluralize(hours, 'hour') + ' &nbsp;&nbsp;\n                ' + pluralize(minutes, 'minute') + ' &nbsp;&nbsp;\n                ' + pluralize(seconds, 'second') + '\n            ');
        }
    }, 1000);
});

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
