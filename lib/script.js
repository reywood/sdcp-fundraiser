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
    handleCheckoutSuccessOrCancel();
});

var stripeCheckout = {
    checkout: function checkout() {
        var _this = this;

        this.requestSessionId().then(function (sessionId) {
            _this.redirectToCheckout(sessionId);
        });
    },
    requestSessionId: function requestSessionId() {
        var _this2 = this;

        var url = 'https://api.sdcpfundraiser.org/default/sdcp-ticket-order';
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'POST',
                cache: 'no-cache',
                mode: 'cors',
                body: _this2.buildSessionRequestBody()
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
    },
    redirectToCheckout: function redirectToCheckout(sessionId) {
        var stripe = new Stripe('pk_test_f2pBW8S36KI3jielImS2Odg2'); // , {
        //     stripeAccount: 'acct_1E2m0vASc7ERbwvp'
        // });
        stripe.redirectToCheckout({ sessionId: sessionId });
    },
    buildSessionRequestBody: function buildSessionRequestBody() {
        var baseReturnUrl = location.protocol + '//' + location.host + location.pathname;
        var price = ticketForm.getSelectedPrice();
        var quantity = ticketForm.getQuantity();
        return JSON.stringify({
            buyerName: ticketForm.getBuyerName(),
            ticketAmount: price,
            quantity: quantity,
            attendeeType: ticketForm.getAttendeeType(),
            inHonorOf: ticketForm.getTicketInHonorOf(),
            successUrl: baseReturnUrl + '?checkout-status=success&price=' + price + '&quantity=' + quantity,
            cancelUrl: baseReturnUrl + '?checkout-status=cancel'
        });
    }
};

function handleCheckoutSuccessOrCancel() {
    var searchParams = new URLSearchParams(window.location.search);
    var chargeStatus = searchParams.get('checkout-status');
    if (chargeStatus === 'success') {
        showCheckoutSuccessMessage();
        logSuccessfulCheckout(searchParams);
    }
    if (chargeStatus === 'cancel') {
        logCancelledCheckout();
    }
}

function showCheckoutSuccessMessage() {
    var $alert = $('\n        <div class="alert alert-success alert-dismissible fade show text-center" role="alert">\n            <h4 class="alert-heading">Thank you!</h4>\n            Your payment has been received. We\'ll see you at the gala!\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n                <span aria-hidden="true">&times;</span>\n            </button>\n        </div>\n    ');
    $alert.alert();
    $('.alert-container').append($alert);
    setTimeout(function () {
        $alert.alert('close');
    }, 10000);
}

function logSuccessfulCheckout(searchParams) {
    var price = searchParams.get('price');
    var quantity = searchParams.get('quantity');
    if (price && quantity) {
        var total = parseInt(price, 10) * parseInt(quantity, 10);
        gtag && gtag('event', 'Purchase tickets', { value: total });
    }
}

function logCancelledCheckout() {
    gtag && gtag('event', 'Cancel checkout');
}
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

$(function () {
    ticketForm.init(function () {
        return stripeCheckout.checkout();
    });
});

var ticketForm = {
    init: function init(checkoutHandler) {
        this.createCheckoutButton(checkoutHandler);
        this.bindToggleInHonorOfOnAttendeeTypeChange();
        this.toggleInHonorOf();
        // $('.purchase-container form .form-check').css('color', 'red');
    },
    createCheckoutButton: function createCheckoutButton(checkoutHandler) {
        var _this = this;

        var checkoutBtn = document.createElement('button');
        checkoutBtn.classList.add('btn');
        checkoutBtn.classList.add('btn-success');
        checkoutBtn.textContent = 'Checkout';
        checkoutBtn.addEventListener('click', function () {
            return _this.handleCheckoutButtonClick(checkoutBtn);
        });

        document.getElementById('payment-button').appendChild(checkoutBtn);

        return checkoutBtn;
    },
    handleCheckoutButtonClick: function handleCheckoutButtonClick(checkoutBtn) {
        var _this2 = this;

        checkoutBtn.disabled = true;
        this.toggleValidationMessage();

        if (this.doAllFieldsPassValidation()) {
            this.showCheckingOutIndicator(checkoutBtn);
            this.logCheckoutButtonClickEvent();
            checkoutHandler();
        } else {
            checkoutBtn.disabled = false;
            if (!this.isFormInputChangeValidationHandlerAttached) {
                this.onFormInputChange(function () {
                    return _this2.toggleValidationMessage();
                });
                this.isFormInputChangeValidationHandlerAttached = true;
            }
        }
    },
    showCheckingOutIndicator: function showCheckingOutIndicator(checkoutBtn) {
        var counter = 0;
        setInterval(function () {
            var ellipsis = [].concat(_toConsumableArray(Array(counter))).map(function () {
                return '.';
            }).join('');
            var text = 'Checking out ' + ellipsis;
            counter = ++counter % 4;
            checkoutBtn.textContent = text;
        }, 500);
    },
    bindToggleInHonorOfOnAttendeeTypeChange: function bindToggleInHonorOfOnAttendeeTypeChange() {
        var _this3 = this;

        $('input[name="attendee-type"]').on('change', function (e) {
            _this3.toggleInHonorOf();
        });
    },
    toggleInHonorOf: function toggleInHonorOf() {
        if ($('#attendee-type-friend').prop('checked')) {
            $('.form-group-in-honor-of').addClass('active');
        } else {
            $('.form-group-in-honor-of').removeClass('active');
        }
    },
    logCheckoutButtonClickEvent: function logCheckoutButtonClickEvent() {
        try {
            validate();
            gtag && gtag('event', 'Checkout');
        } catch (error) {
            gtag && gtag('event', 'Fail form validation', { category: 'error', label: error.message });
        }
    },
    validate: function validate() {
        var integerRegex = /^[0-9]+$/;

        var buyerName = this.getBuyerName();
        if (!buyerName || buyerName.length <= 0) {
            throw new FormValidationError('Please enter your name');
        }

        var price = this.getSelectedPrice();
        if (!integerRegex.test(price)) {
            throw new FormValidationError('Select a valid price');
        }

        var quantity = this.getQuantity();
        if (!integerRegex.test(quantity) || parseInt(quantity, 10) <= 0) {
            throw new FormValidationError('Select a valid quantity');
        }

        var attendeeType = this.getAttendeeType();
        if (!attendeeType || attendeeType.length <= 0) {
            throw new FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
        }
    },
    onFormInputChange: function onFormInputChange(handler) {
        $('.purchase-container input').on('change', handler);
        $('.purchase-container input[type="text"]').on('input', handler);
    },
    toggleValidationMessage: function toggleValidationMessage() {
        if (this.doAllFieldsPassValidation()) {
            $('.validation-error').hide();
        } else {
            $('.validation-error').show();
        }
    },
    doAllFieldsPassValidation: function doAllFieldsPassValidation() {
        try {
            this.validate();
            return true;
        } catch (error) {
            return false;
        }
    },
    getBuyerName: function getBuyerName() {
        return $('#ticket-buyer-name').val();
    },
    getSelectedPrice: function getSelectedPrice() {
        var selectedAmount = this.getSelectedPriceRadio().val();
        if (selectedAmount === 'other') {
            selectedAmount = $('input[name="other-amount"]').val();
        }
        return selectedAmount;
    },
    getSelectedPriceRadio: function getSelectedPriceRadio() {
        return $('input[name="ticket-amount"]:checked');
    },
    getQuantity: function getQuantity() {
        return $('#ticket-quantity').val();
    },
    getTicketInHonorOf: function getTicketInHonorOf() {
        var isActive = $('.form-group-in-honor-of').hasClass('active');
        return isActive ? $('#ticket-in-honor-of').val() : '';
    },
    getAttendeeType: function getAttendeeType() {
        return $('input[name="attendee-type"]:checked').val();
    }
};

var FormValidationError = function (_Error) {
    _inherits(FormValidationError, _Error);

    function FormValidationError(message) {
        _classCallCheck(this, FormValidationError);

        return _possibleConstructorReturn(this, (FormValidationError.__proto__ || Object.getPrototypeOf(FormValidationError)).call(this, message));
    }

    return FormValidationError;
}(Error);
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
