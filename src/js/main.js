$(() => {
    $('#buy-tickets-link, #donate-link').click((e) => {
        e.preventDefault();

        const $linkToElement = $($(e.target).attr('href'));
        $('html, body').animate({scrollTop: $linkToElement.offset().top}, 500);
    });

    $('input[name="other-amount"]').on('input', (e) => {
        $('#ticket-amount-other').prop('checked', true);
    });

    $('#donate-form').on('submit', (e) => {
        e.preventDefault();

        const width = 600;
        const height = 600;
        const top = (screen.availHeight - height) / 2;
        const left = (screen.availWidth - width) / 2;

        window.open('', 'sdcpDonatePopup', `width=${width},height=${height},top=${top},left=${left}`);
        $('#donate-form').attr('target', 'sdcpDonatePopup');
        document.getElementById('donate-form').submit();
    });
});
