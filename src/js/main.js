$(() => {
    $('#buy-tickets-button').click((e) => {
        e.preventDefault();

        $('html, body').animate({
            scrollTop: $('#buy-tickets').offset().top,
        }, 500);
    });
});
