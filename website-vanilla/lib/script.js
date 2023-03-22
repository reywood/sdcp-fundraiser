'use strict';

var devConfig = {
    environment: 'dev',
    stripeKey: 'pk_test_f2pBW8S36KI3jielImS2Odg2'
};
var prodConfig = {
    environment: 'prod',
    stripeKey: 'pk_live_mnRjCTNhog7LSLemgyxoS5nm'
};
var config = {
    saleStartDate: moment('2023-03-20T00:00:00-07:00', moment.ISO_8601).toDate(),
    saleEndDate: moment('2023-05-19T00:00:00-07:00', moment.ISO_8601).toDate(),

    // May 19, 2023 7:00pm -0700
    eventStartDate: moment('2023-05-19T19:00:00-07:00', moment.ISO_8601).toDate(),
    eventEndDate: moment('2023-05-19T22:00:00-07:00', moment.ISO_8601).toDate()
};
Object.assign(config, devConfig);
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

$(function () {
    donationForm.init({
        checkoutHandler: function checkoutHandler(_ref) {
            var amount = _ref.amount,
                donorName = _ref.donorName,
                ticketInHonorOf = _ref.ticketInHonorOf,
                ccFeeOffset = _ref.ccFeeOffset;

            return stripeDonateSession({ amount: amount, donorName: donorName, ticketInHonorOf: ticketInHonorOf, ccFeeOffset: ccFeeOffset }).checkout();
        }
    });
});

var donationForm = {
    init: function init(_ref2) {
        var _this = this;

        var checkoutHandler = _ref2.checkoutHandler;

        document.getElementById('donation-form').addEventListener('submit', function (e) {
            e.preventDefault();
            _this.handleSubmit(function () {
                return checkoutHandler({
                    amount: _this.getAmount(),
                    donorName: _this.getDonorName(),
                    ticketInHonorOf: _this.getTicketInHonorOf(),
                    ccFeeOffset: _this.getCcFeeOffset()
                });
            });
        });
    },
    handleSubmit: function handleSubmit(checkoutHandler) {
        var _this2 = this;

        var donateBtn = document.querySelector('#donate-button button');
        var donateBtnOriginalText = donateBtn.textContent;
        donateBtn.disabled = true;
        this.toggleValidationMessage();

        if (this.doAllFieldsPassValidation()) {
            this.showCheckingOutIndicator(donateBtn);
            this.logDonateButtonClickEvent();
            checkoutHandler().catch(function (error) {
                console.log(error);
                alert('Unable to process donation. Please try again.');
                if (_this2.checkingOutInterval) {
                    clearInterval(_this2.checkingOutInterval);
                    _this2.checkingOutInterval = null;
                }
                donateBtn.textContent = donateBtnOriginalText;
                donateBtn.disabled = false;
            });
        } else {
            donateBtn.disabled = false;
            if (!this.isFormInputChangeValidationHandlerAttached) {
                this.onFormInputChange(function () {
                    return _this2.toggleValidationMessage();
                });
                this.isFormInputChangeValidationHandlerAttached = true;
            }
        }
    },
    showCheckingOutIndicator: function showCheckingOutIndicator(donateBtn) {
        var counter = 0;
        this.checkingOutInterval = setInterval(function () {
            var ellipsis = [].concat(_toConsumableArray(Array(counter))).map(function () {
                return '.';
            }).join('');
            var text = 'Processing ' + ellipsis;
            counter = ++counter % 4;
            donateBtn.textContent = text;
        }, 500);
    },
    logDonateButtonClickEvent: function logDonateButtonClickEvent() {
        try {
            validate();
            gtag && gtag('event', 'Donation checkout');
        } catch (error) {
            gtag && gtag('event', 'Fail donation form validation', { category: 'error', label: error.message });
        }
    },
    toggleValidationMessage: function toggleValidationMessage() {
        if (this.doAllFieldsPassValidation()) {
            $('.donation-validation-error').hide();
        } else {
            $('.donation-validation-error').show();
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
    validate: function validate() {
        var integerRegex = /^[0-9]+$/;

        var donorName = this.getDonorName();
        if (!donorName || donorName.length <= 0) {
            throw new FormValidationError('Please enter your name');
        }

        var amount = this.getAmount();
        if (!integerRegex.test(amount)) {
            throw new FormValidationError('Enter a valid donation amount');
        }
    },
    onFormInputChange: function onFormInputChange(handler) {
        $('.donate-container input').on('change', handler);
        $('.donate-container input[type="text"], .donate-container input[type="number"]').on('input', handler);
    },
    getDonorName: function getDonorName() {
        return $('#donation-donor-name').val();
    },
    getAmount: function getAmount() {
        return $('#donation-amount').val();
    },
    getTicketInHonorOf: function getTicketInHonorOf() {
        return $('#donation-in-honor-of').val();
    },
    getCcFeeOffset: function getCcFeeOffset() {
        if ($('#donate-cc-fee-offset').prop('checked')) {
            var amount = parseFloat(this.getAmount());
            return calculateCreditCardProcessingFee(amount);
        }
        return 0;
    },


    FormValidationError: function (_Error) {
        _inherits(FormValidationError, _Error);

        function FormValidationError(message) {
            _classCallCheck(this, FormValidationError);

            return _possibleConstructorReturn(this, (FormValidationError.__proto__ || Object.getPrototypeOf(FormValidationError)).call(this, message));
        }

        return FormValidationError;
    }(Error)
};
"use strict";

function getEarlyBirdSales() {
    var saleStartDate = config.saleStartDate;
    return [
        // {
        //     startDate: saleStartDate,
        //     endDate: moment(saleStartDate)
        //         .add(2, 'weeks')
        //         .toDate(),
        //     bonusRaffleTickets: 2
        // },
        // {
        //     startDate: moment(saleStartDate)
        //         .add(2, 'weeks')
        //         .add(1, 'second')
        //         .toDate(),
        //     endDate: moment(saleStartDate)
        //         .add(4, 'weeks')
        //         .toDate(),
        //     bonusRaffleTickets: 1
        // }
    ];
}
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
    var js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

$(function () {
    var shareUrl = $('meta[property="og:url"]').attr('content');
    $('#fb-share-btn').on('click', function () {
        try {
            FB.ui({
                method: 'share',
                href: shareUrl
            }, function (response) {});
        } catch (error) {
            console.log('Unable to open FB share', error);
            window.open('https://facebook.com/', '_blank');
        }

        gtag && gtag('event', 'Share on Facebook');
    });
});
'use strict';

$(function () {
    initSmoothNavLinkScrolling();
});

function initSmoothNavLinkScrolling() {
    $('.js-internal-link').on('click', function (e) {
        e.preventDefault();

        var selector = $(e.target).attr('href');
        var $linkToElement = $(selector);
        var navBarHeight = 50;
        $('html, body').animate({ scrollTop: $linkToElement.offset().top - navBarHeight }, 500);
    });
}
'use strict';

$(function () {
    stripeCheckoutResponse.handleCheckoutSuccessOrCancel();
});

var stripeCheckoutSession = function stripeCheckoutSession(_ref) {
    var selectedPrice = _ref.selectedPrice,
        quantity = _ref.quantity,
        buyerName = _ref.buyerName,
        attendeeType = _ref.attendeeType,
        ticketInHonorOf = _ref.ticketInHonorOf,
        _ref$ccFeeOffset = _ref.ccFeeOffset,
        ccFeeOffset = _ref$ccFeeOffset === undefined ? 0 : _ref$ccFeeOffset;

    return {
        checkout: function checkout() {
            var _this = this;

            return this.requestSessionId().then(function (sessionId) {
                try {
                    _this.redirectToCheckout(sessionId);
                } catch (err) {
                    console.log('Failed to redirect to checkout', err);
                }
            });
        },
        requestSessionId: function requestSessionId() {
            var _this2 = this;

            var url = 'https://api.sdcpfundraiser.org/default/sdcp-ticket-order';
            return new Promise(function (resolve, reject) {
                var body = _this2.buildSessionRequestBody();
                console.log(body);
                fetch(url, {
                    method: 'POST',
                    cache: 'no-cache',
                    mode: 'cors',
                    body: body
                }).then(function (response) {
                    if (!response.ok) {
                        throw new Error('Request failed: ' + response.statusText);
                    }
                    return response.json();
                }).then(function (responseJson) {
                    resolve(responseJson.sessionId);
                }).catch(function (error) {
                    reject(error);
                });
            });
        },
        redirectToCheckout: function redirectToCheckout(sessionId) {
            var stripe = new Stripe(config.stripeKey);
            stripe.redirectToCheckout({ sessionId: sessionId });
        },
        buildSessionRequestBody: function buildSessionRequestBody() {
            var baseReturnUrl = location.protocol + '//' + location.host + location.pathname;
            return JSON.stringify({
                environment: config.environment,
                buyerName: buyerName,
                ticketAmount: selectedPrice,
                quantity: quantity,
                attendeeType: attendeeType,
                inHonorOf: ticketInHonorOf,
                ccFeeOffset: ccFeeOffset,
                successUrl: baseReturnUrl + '?checkout-status=success&price=' + selectedPrice + '&quantity=' + quantity,
                cancelUrl: baseReturnUrl + '?checkout-status=cancel'
            });
        }
    };
};

var stripeCheckoutResponse = {
    handleCheckoutSuccessOrCancel: function handleCheckoutSuccessOrCancel() {
        var searchParams = new URLSearchParams(window.location.search);
        var chargeStatus = searchParams.get('checkout-status');
        if (chargeStatus === 'success') {
            this.showCheckoutSuccessMessage();
            this.logSuccessfulCheckout(searchParams);
        }
        if (chargeStatus === 'cancel') {
            this.logCancelledCheckout();
        }
    },
    showCheckoutSuccessMessage: function showCheckoutSuccessMessage() {
        var $alert = $('\n        <div class="alert alert-success alert-dismissible fade show text-center" role="alert">\n            <h4 class="alert-heading">Thank you!</h4>\n            Your payment has been received. We\'ll see you at the gala!\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n                <span aria-hidden="true">&times;</span>\n            </button>\n        </div>\n    ');
        $alert.alert();
        $('.alert-container').append($alert);
        setTimeout(function () {
            $alert.alert('close');
        }, 10000);
    },
    logSuccessfulCheckout: function logSuccessfulCheckout(searchParams) {
        var price = searchParams.get('price');
        var quantity = searchParams.get('quantity');
        if (price && quantity) {
            var total = parseInt(price, 10) * parseInt(quantity, 10);
            gtag && gtag('event', 'Ticket purchase successful', { value: total });
        }
    },
    logCancelledCheckout: function logCancelledCheckout() {
        gtag && gtag('event', 'Cancel checkout');
    }
};
'use strict';

$(function () {
    stripeDonateResponse.handleDonationSuccessOrCancel();
});

var stripeDonateSession = function stripeDonateSession(_ref) {
    var amount = _ref.amount,
        donorName = _ref.donorName,
        ticketInHonorOf = _ref.ticketInHonorOf,
        _ref$ccFeeOffset = _ref.ccFeeOffset,
        ccFeeOffset = _ref$ccFeeOffset === undefined ? 0 : _ref$ccFeeOffset;

    return {
        checkout: function checkout() {
            var _this = this;

            return this.requestSessionId().then(function (sessionId) {
                _this.redirectToCheckout(sessionId);
            });
        },
        requestSessionId: function requestSessionId() {
            var _this2 = this;

            var url = 'https://api.sdcpfundraiser.org/default/sdcp-donate';
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
                    reject(error);
                });
            });
        },
        redirectToCheckout: function redirectToCheckout(sessionId) {
            var stripe = new Stripe(config.stripeKey);
            stripe.redirectToCheckout({ sessionId: sessionId });
        },
        buildSessionRequestBody: function buildSessionRequestBody() {
            var baseReturnUrl = location.protocol + '//' + location.host + location.pathname;
            return JSON.stringify({
                environment: config.environment,
                donorName: donorName,
                amount: amount,
                inHonorOf: ticketInHonorOf,
                ccFeeOffset: ccFeeOffset,
                successUrl: baseReturnUrl + '?donation-status=success&amount=' + amount,
                cancelUrl: baseReturnUrl + '?donation-status=cancel'
            });
        }
    };
};

var stripeDonateResponse = {
    handleDonationSuccessOrCancel: function handleDonationSuccessOrCancel() {
        var searchParams = new URLSearchParams(window.location.search);
        var donationStatus = searchParams.get('donation-status');
        if (donationStatus === 'success') {
            this.showDonationSuccessMessage();
            this.logSuccessfulDonation(searchParams);
        }
        if (donationStatus === 'cancel') {
            this.logCancelledDonation();
        }
    },
    showDonationSuccessMessage: function showDonationSuccessMessage() {
        var $alert = $('\n        <div class="alert alert-success alert-dismissible fade show text-center" role="alert">\n            <h4 class="alert-heading">Thank you!</h4>\n            Your donation has been received. Your support is greatly appreciated!\n            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n                <span aria-hidden="true">&times;</span>\n            </button>\n        </div>\n    ');
        $alert.alert();
        $('.alert-container').append($alert);
        setTimeout(function () {
            $alert.alert('close');
        }, 10000);
    },
    logSuccessfulDonation: function logSuccessfulDonation(searchParams) {
        var amount = searchParams.get('amount');
        if (amount) {
            gtag && gtag('event', 'Donation successful', { value: parseInt(amount, 10) });
        }
    },
    logCancelledDonation: function logCancelledDonation() {
        gtag && gtag('event', 'Cancel donation');
    }
};
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

$(function () {
    ticketForm.init({
        checkoutHandler: function checkoutHandler(_ref) {
            var selectedPrice = _ref.selectedPrice,
                quantity = _ref.quantity,
                buyerName = _ref.buyerName,
                attendeeType = _ref.attendeeType,
                ticketInHonorOf = _ref.ticketInHonorOf,
                ccFeeOffset = _ref.ccFeeOffset;

            return stripeCheckoutSession({
                selectedPrice: selectedPrice,
                quantity: quantity,
                buyerName: buyerName,
                attendeeType: attendeeType,
                ticketInHonorOf: ticketInHonorOf,
                ccFeeOffset: ccFeeOffset
            }).checkout();
        }
    });
});

var ticketForm = {
    init: function init(_ref2) {
        var _this = this;

        var checkoutHandler = _ref2.checkoutHandler;

        document.getElementById('ticket-purchase-form').addEventListener('submit', function (e) {
            e.preventDefault();
            _this.handleSubmit(function () {
                return checkoutHandler({
                    selectedPrice: _this.getSelectedPrice(),
                    quantity: _this.getQuantity(),
                    buyerName: _this.getBuyerName(),
                    attendeeType: _this.getAttendeeType(),
                    ticketInHonorOf: _this.getTicketInHonorOf(),
                    ccFeeOffset: _this.getCcFeeOffset()
                });
            });
        });

        this.showAppropriateContent();
        this.bindToggleInHonorOfOnAttendeeTypeChange();
        this.toggleInHonorOf();
        // $('.purchase-container form .form-check').css('color', 'red');
    },
    showAppropriateContent: function showAppropriateContent() {
        var now = new Date();
        if (now < config.saleStartDate) {
            document.querySelector('.ticket-sale-start-date').textContent = moment(config.saleStartDate).format('MMMM Do');
            document.querySelector('.purchase-check-back').style.display = 'block';
        } else if (now > config.saleEndDate) {
            document.querySelector('.purchase-after-event').style.display = 'block';
        } else {
            document.querySelector('#ticket-purchase-form').style.display = 'block';
            this.showEarlyBirdOfferIfApplicable();
        }
    },
    showEarlyBirdOfferIfApplicable: function showEarlyBirdOfferIfApplicable() {
        var earlyBirdSales = getEarlyBirdSales();
        var now = new Date();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = earlyBirdSales[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var saleInfo = _step.value;

                if (now >= saleInfo.startDate && now <= saleInfo.endDate) {
                    var container = document.querySelector('.purchase-early-bird');
                    var offerDetailElement = container.querySelector('.early-bird-offer');
                    var detail = saleInfo.bonusRaffleTickets + ' extra raffle ' + this.pluralize(saleInfo.bonusRaffleTickets, 'ticket');
                    offerDetailElement.textContent = detail;
                    container.style.display = 'block';

                    document.querySelector('.purchase-container-tickets').classList.add('early-bird-' + saleInfo.bonusRaffleTickets);

                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },
    pluralize: function pluralize(qty, noun) {
        if (qty === 1) {
            return noun;
        }
        return noun + 's';
    },
    handleSubmit: function handleSubmit(checkoutHandler) {
        var _this2 = this;

        var checkoutBtn = document.querySelector('#payment-button button');
        var checkoutBtnOriginalText = checkoutBtn.textContent;
        checkoutBtn.disabled = true;
        this.toggleValidationMessage();

        if (this.doAllFieldsPassValidation()) {
            this.showCheckingOutIndicator(checkoutBtn);
            this.logCheckoutButtonClickEvent();
            checkoutHandler().catch(function (error) {
                console.log(error);
                alert('Unable to process checkout. Please try again.');
                if (_this2.checkingOutInterval) {
                    clearInterval(_this2.checkingOutInterval);
                    _this2.checkingOutInterval = null;
                }
                checkoutBtn.textContent = checkoutBtnOriginalText;
                checkoutBtn.disabled = false;
            });
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
        this.checkingOutInterval = setInterval(function () {
            var ellipsis = [].concat(_toConsumableArray(Array(counter))).map(function () {
                return '.';
            }).join('');
            var text = 'Processing ' + ellipsis;
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
            gtag && gtag('event', 'Ticket checkout');
        } catch (error) {
            gtag && gtag('event', 'Fail checkout form validation', { category: 'error', label: error.message });
        }
    },
    validate: function validate() {
        var integerRegex = /^[0-9]+$/;

        var buyerName = this.getBuyerName();
        if (!buyerName || buyerName.length <= 0) {
            throw new this.FormValidationError('Please enter your name');
        }

        var price = this.getSelectedPrice();
        if (!integerRegex.test(price)) {
            throw new this.FormValidationError('Select a valid price');
        }

        var quantity = this.getQuantity();
        if (!integerRegex.test(quantity) || parseInt(quantity, 10) <= 0) {
            throw new this.FormValidationError('Select a valid quantity');
        }

        var attendeeType = this.getAttendeeType();
        if (!attendeeType || attendeeType.length <= 0) {
            throw new this.FormValidationError('Please specifiy whether you are currently enrolled, an alum, etc');
        }
    },
    onFormInputChange: function onFormInputChange(handler) {
        $('.purchase-container input').on('change', handler);
        $('.purchase-container input[type="text"], .purchase-container input[type="number"]').on('input', handler);
    },
    toggleValidationMessage: function toggleValidationMessage() {
        if (this.doAllFieldsPassValidation()) {
            $('.checkout-validation-error').hide();
        } else {
            $('.checkout-validation-error').show();
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
        // return this.getSelectedPriceRadio().val();
        return $('input[name="ticket-amount"]').val();
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
    getCcFeeOffset: function getCcFeeOffset() {
        if ($('#ticket-cc-fee-offset').prop('checked')) {
            var total = parseFloat(this.getSelectedPrice()) * parseInt(this.getQuantity(), 10);
            return calculateCreditCardProcessingFee(total);
        }
        return 0;
    },
    getAttendeeType: function getAttendeeType() {
        return $('input[name="attendee-type"]:checked').val();
    },


    FormValidationError: function (_Error) {
        _inherits(FormValidationError, _Error);

        function FormValidationError(message) {
            _classCallCheck(this, FormValidationError);

            return _possibleConstructorReturn(this, (FormValidationError.__proto__ || Object.getPrototypeOf(FormValidationError)).call(this, message));
        }

        return FormValidationError;
    }(Error)
};
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

$(function () {
    timeLeftDisplay.init();
});

var timeLeftDisplay = {
    init: function init() {
        var _this = this;

        this.update();
        $('.time-left').animate({ opacity: 1 }, 500);
        setInterval(function () {
            return _this.update();
        }, 15 * 1000);
    },
    update: function update() {
        var _getTimeLeft = this.getTimeLeft(),
            weeks = _getTimeLeft.weeks,
            days = _getTimeLeft.days,
            hours = _getTimeLeft.hours,
            minutes = _getTimeLeft.minutes,
            seconds = _getTimeLeft.seconds;

        if (days + hours + minutes + seconds <= 0) {
            $('.time-left').html('');
            return;
        }

        if (weeks > 0) {
            this.display([[weeks, 'week']]);
        } else if (days > 0) {
            this.display([[days, 'day']]);
        } else {
            this.display([[hours, 'hour'], [minutes, 'minute']]);
        }
    },
    display: function display(timeComponents) {
        var _this2 = this;

        var html = timeComponents.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                value = _ref2[0],
                label = _ref2[1];

            return '<span>' + _this2.pluralize(value, label) + '</span>';
        }).join(' and ');
        $('.time-left').html(html + ' until party time!');
    },
    pluralize: function pluralize(number, label) {
        if (number === 1) {
            return number + ' ' + label;
        }
        return number + ' ' + label + 's';
    },
    getTimeLeft: function getTimeLeft() {
        var now = new Date();
        var secondsLeft = (config.eventStartDate.getTime() - now.getTime()) / 1000;
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
};
'use strict';

$(function () {
    var h1 = document.querySelector('.section1 h1');
    if (h1) {
        titleColorizer(h1).colorize();
    }
});

var titleColorizer = function titleColorizer(element) {
    return {
        colors: ['#6375c7', '#ed6660', '#cc62a0', '#a0b31c', '#08b8ad', '#ffb741'],
        currentColorIndex: 0,
        colorize: function colorize() {
            var text = element.textContent;

            this._removeAllChildren();
            var newChildren = this._createColorizedTextElements(text);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = newChildren[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var child = _step.value;

                    element.appendChild(child);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        },
        _removeAllChildren: function _removeAllChildren() {
            while (element.firstChild) {
                element.firstChild.remove();
            }
        },
        _createColorizedTextElements: function _createColorizedTextElements(text) {
            var _this = this;

            return text.split('').map(function (char) {
                if (char === ' ') {
                    return document.createTextNode(char);
                }
                var span = document.createElement('span');
                span.style.color = _this._getNextColor();
                span.textContent = char;
                return span;
            });
        },
        _getNextColor: function _getNextColor() {
            var nextColor = this.colors[this.currentColorIndex];
            this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
            return nextColor;
        }
    };
};
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
"use strict";

function calculateCreditCardProcessingFee(amount) {
    var fee = amount * .029 + .3;
    return Math.round(fee * 100) / 100;
}
