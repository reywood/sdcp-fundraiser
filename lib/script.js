'use strict';

window.fbAsyncInit = function () {
    FB.init({
        appId: '1784939915147073',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.12'
    });
    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    if (d.getElementById(id)) {
        return;
    }
    var fjs = d.getElementsByTagName(s)[0];
    var js = d.createElement(s);js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

$(function () {
    var shareUrl = $('meta[property="og:url"]').attr('content');
    $('#fb-share-btn').on('click', function () {
        FB.ui({
            method: 'share',
            href: shareUrl
        }, function (response) {});

        gtag && gtag('event', 'Share on Facebook');
    });
});
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

    $('#donate-form').on('submit', function (e) {
        e.preventDefault();

        var width = 600;
        var height = 600;
        var top = (screen.availHeight - height) / 2;
        var left = (screen.availWidth - width) / 2;

        window.open('', 'sdcpDonatePopup', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
        $('#donate-form').attr('target', 'sdcpDonatePopup');
        document.getElementById('donate-form').submit();
    });
});
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

$(function () {
    $('input[name="attendee-type"]').on('change', function (e) {
        var checkbox = e.target;
        if (checkbox.id === 'attendee-type-friend' && checkbox.checked) {
            $('.form-group-in-honor-of').addClass('active');
        } else {
            $('.form-group-in-honor-of').removeClass('active');
        }
    });

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
            logCheckoutButtonClickEvent();
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

                var price = parseInt(getSelectedPrice(), 10);
                var quantity = parseInt(getQuantity(), 10);
                var total = price * quantity;
                gtag && gtag('event', 'Purchase tickets', { value: total });
            });
        },
        onCancel: function onCancel(data, actions) {
            gtag && gtag('event', 'Cancel checkout');
        },
        onError: function onError(err) {
            // This doesn't work
            // if (err instanceof FormValidationError) {
            //     $('.validation-error').show();
            // }
        }
    }, '#paypal-button');
});

var FormValidationError = function (_Error) {
    _inherits(FormValidationError, _Error);

    function FormValidationError(message) {
        _classCallCheck(this, FormValidationError);

        return _possibleConstructorReturn(this, (FormValidationError.__proto__ || Object.getPrototypeOf(FormValidationError)).call(this, message));
    }

    return FormValidationError;
}(Error);

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

function onFormInputChange(handler) {
    $('.purchase-container input').on('change', handler);
}

function togglePaypalButton(actions) {
    if (doAllFieldsPassValidation()) {
        actions.enable();
    } else {
        actions.disable();
    }
}

function toggleValidationMessage() {
    if (doAllFieldsPassValidation()) {
        $('.validation-error').hide();
    } else {
        $('.validation-error').show();
    }
}

function logCheckoutButtonClickEvent() {
    try {
        validate();
        gtag && gtag('event', 'Checkout');
    } catch (error) {
        gtag && gtag('event', 'Fail form validation', { category: 'error', label: error.message });
    }
}

function doAllFieldsPassValidation() {
    try {
        validate();
        return true;
    } catch (error) {
        return false;
    }
}

function getSelectedPrice() {
    var selectedAmount = getSelectedPriceRadio().val();
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
    var inHonorOf = getTicketInHonorOf();
    if (inHonorOf) {
        itemNameParts.push('(' + attendeeType + ', in honor of ' + inHonorOf + ')');
    } else {
        itemNameParts.push('(' + attendeeType + ')');
    }

    return itemNameParts.join(' ');
}

function getTicketInHonorOf() {
    var isActive = $('.form-group-in-honor-of').hasClass('active');
    return isActive ? $('#ticket-in-honor-of').val() : '';
}

function getAttendeeType() {
    return $('input[name="attendee-type"]:checked').val();
}

function getExtras() {
    return getSelectedPriceRadio().data('extras');
}
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// May 3, 2019 7:00pm -0700
var eventDate = new Date('2019-05-04T02:00:00Z');

$(function () {
    updateTimeLeftDisplay();
    $('.time-left').animate({ opacity: 1 }, 500);
    setInterval(updateTimeLeftDisplay, 15 * 1000);
});

function updateTimeLeftDisplay() {
    var _timeLeft = timeLeft(),
        weeks = _timeLeft.weeks,
        days = _timeLeft.days,
        hours = _timeLeft.hours,
        minutes = _timeLeft.minutes,
        seconds = _timeLeft.seconds;

    if (days + hours + minutes + seconds <= 0) {
        $('.time-left').html('');
        return;
    }

    if (weeks > 0) {
        display([[weeks, 'week']]);
    } else if (days > 0) {
        display([[days, 'day']]);
    } else {
        display([[hours, 'hour'], [minutes, 'minute']]);
    }
}

function display(timeComponents) {
    var html = timeComponents.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            value = _ref2[0],
            label = _ref2[1];

        return '<span>' + pluralize(value, label) + '</span>';
    }).join(' and ');
    $('.time-left').html(html + ' until party time!');
}

function pluralize(number, label) {
    if (number === 1) {
        return number + ' ' + label;
    }
    return number + ' ' + label + 's';
};

function timeLeft() {
    var now = new Date();
    var secondsLeft = (eventDate.getTime() - now.getTime()) / 1000;
    var weeksLeft = Math.floor(secondsLeft / 60 / 60 / 24 / 7);
    var daysLeft = Math.floor(secondsLeft / 60 / 60 / 24) % 7;
    var hoursLeft = Math.floor(secondsLeft / 60 / 60) % 24;
    var minutesLeft = Math.floor(secondsLeft / 60) % 60;

    return {
        weeks: weeksLeft,
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: Math.floor(secondsLeft % 60)
    };
}
'use strict';

$(function () {
    $('.twitter-share-btn').on('click', function (e) {
        e.preventDefault();

        var width = 600;
        var height = 250;
        var top = (screen.availHeight - height) / 2;
        var left = (screen.availWidth - width) / 2;

        window.open(e.target.href, 'twitterShare', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);

        gtag && gtag('event', 'Share on Twitter');
    });
});
