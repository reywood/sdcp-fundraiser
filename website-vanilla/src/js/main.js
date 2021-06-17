$(() => {
    initSmoothNavLinkScrolling();
});

function initSmoothNavLinkScrolling() {
    $('.js-internal-link').on('click', e => {
        e.preventDefault();

        const selector = $(e.target).attr('href');
        const $linkToElement = $(selector);
        const navBarHeight = 50;
        $('html, body').animate({scrollTop: $linkToElement.offset().top - navBarHeight}, 500);
    });
}
