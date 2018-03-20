$(() => {
    $('#buy-tickets-link, #donate-link').click((e) => {
        e.preventDefault();

        const $linkToElement = $($(e.target).attr('href'));
        $('html, body').animate({scrollTop: $linkToElement.offset().top}, 500);
    });

    $('input[name="other-amount"]').on('input', (e) => {
        $('#ticket-amount-other').prop('checked', true);
    });
});
