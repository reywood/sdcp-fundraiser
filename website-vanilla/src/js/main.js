$(() => {
    initSmoothNavLinkScrolling();
});

function initSmoothNavLinkScrolling() {
    $('.js-buy-tickets-link, .js-donate-link, .js-location-link').on('click', e => {
        e.preventDefault();

        const $linkToElement = $($(e.target).attr('href'));
        const navBarHeight = 50;
        $('html, body').animate({scrollTop: $linkToElement.offset().top - navBarHeight}, 500);
    });
}
