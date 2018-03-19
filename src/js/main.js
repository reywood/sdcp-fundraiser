$(() => {
    $('#buy-tickets-button').click((e) => {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $('#buy-tickets').offset().top,
        }, 500);
    });

    $('input[name="other-amount"]').on('input', (e) => {
        $('#ticket-amount-other').prop('checked', true);
    });
});
