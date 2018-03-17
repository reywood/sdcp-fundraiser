$('#buy-tickets-button').click(function(e) {
    e.preventDefault();

    $('html, body').animate({
        scrollTop: $('#buy-tickets').offset().top,
    }, 500);
});

paypal.Button.render({
    env: 'sandbox',
    payment: function(data, actions) {
    },
    onAuthorize: function(data, actions) {
    },
    onCancel: function(data, actions) {
    },
    onError: function(err) {
    },
}, '#paypal-button');
