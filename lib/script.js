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
    $('.js-buy-tickets-link, .js-donate-link, .js-location-link').on('click', function (e) {
        e.preventDefault();

        var $linkToElement = $($(e.target).attr('href'));
        var navBarHeight = 50;
        $('html, body').animate({ scrollTop: $linkToElement.offset().top - navBarHeight }, 500);
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

    // colorizePageHeader();

    // function colorizePageHeader() {
    //     const colors = [
    //         '#e2242e',
    //         '#ee8b2f',
    //         '#589e5d',
    //         '#43a2be',
    //         '#9b3880',
    //         '#419cb7',
    //         // '#e1242e',
    //         '#5ba360',
    //     ];

    //     const h1 = document.querySelector('.section1 h1');
    //     const text = h1.textContent.trim();
    //     const chars = text.split('');
    //     let colorIndex = 0;
    //     const newHTML = chars.map((c) => {
    //         if (/\s/.test(c)) {
    //             return c;
    //         }
    //         if (colorIndex >= colors.length) {
    //             colorIndex = 0;
    //         }
    //         return `<span style="color: ${colors[colorIndex++]}">${c}</span>`;
    //     }).join('');

    //     h1.innerHTML = newHTML;
    // }
});
'use strict';

$(function () {
    createCheckoutButton();
    handleChargeSuccessOrCancel();

    // toggleCheckoutButton(checkoutBtn);
    // onFormInputChange(() => {
    //     toggleCheckoutButton(checkoutBtn);
    // });
});

function handleChargeSuccessOrCancel() {
    var searchParams = new URLSearchParams(window.location.search);
    var chargeStatus = searchParams.get('charge-status');
    if (chargeStatus === 'success') {
        $('.purchase-thank-you').show();
        var price = searchParams.get('price');
        var quantity = searchParams.get('quantity');
        if (price && quantity) {
            var total = parseInt(price, 10) * parseInt(quantity, 10);
            gtag && gtag('event', 'Purchase tickets', { value: total });
        }
    }
    if (chargeStatus === 'cancel') {
        gtag && gtag('event', 'Cancel checkout');
    }
}

function createCheckoutButton() {
    var checkoutBtn = document.createElement('button');
    checkoutBtn.classList.add('btn');
    checkoutBtn.classList.add('btn-success');
    checkoutBtn.textContent = 'Checkout';
    document.getElementById('payment-button').appendChild(checkoutBtn);

    checkoutBtn.addEventListener('click', function () {
        toggleValidationMessage();
        logCheckoutButtonClickEvent();

        if (doAllFieldsPassValidation()) {
            checkoutBtn.disabled = true;

            requestSessionId().then(function (sessionId) {
                redirectToCheckout(sessionId);
            });
        }
    });
}

function requestSessionId() {
    var url = 'https://api.sdcpfundraiser.org/default/sdcp-ticket-order';
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            mode: 'cors',
            body: buildSessionRequestBody()
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        }).then(function (responseJson) {
            resolve(responseJson.sessionId);
        }).catch(function (error) {
            alert('Unable to process order');
            reject(error);
        });
    });
}

function redirectToCheckout(sessionId) {
    var stripe = Stripe('pk_test_f2pBW8S36KI3jielImS2Odg2', {
        stripeAccount: 'acct_1E2m0vASc7ERbwvp'
    });
    stripe.redirectToCheckout({ sessionId: sessionId });
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
    var baseReturnUrl = location.protocol + '//' + location.host + location.pathname;
    var price = getSelectedPrice();
    var quantity = getQuantity();
    return JSON.stringify({
        ticketAmount: price,
        quantity: quantity,
        attendeeType: getAttendeeType(),
        inHonorOf: getTicketInHonorOf(),
        successUrl: baseReturnUrl + '?charge-status=success&price=' + price + '&quantity=' + quantity,
        cancelUrl: baseReturnUrl + '?charge-status=cancel'
    });
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

function getTicketInHonorOf() {
    var isActive = $('.form-group-in-honor-of').hasClass('active');
    return isActive ? $('#ticket-in-honor-of').val() : '';
}

function getAttendeeType() {
    return $('input[name="attendee-type"]:checked').val();
}
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
var eventDate = new Date('2020-05-15T02:00:00Z');

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
