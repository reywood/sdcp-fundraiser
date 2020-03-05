$(() => {
    $('.js-buy-tickets-link, .js-donate-link, .js-location-link').on('click', e => {
        e.preventDefault();

        const $linkToElement = $($(e.target).attr('href'));
        const navBarHeight = 50;
        $('html, body').animate({scrollTop: $linkToElement.offset().top - navBarHeight}, 500);
    });

    $('input[name="other-amount"]').on('input', e => {
        $('#ticket-amount-other').prop('checked', true);
    });

    $('#donate-form').on('submit', e => {
        e.preventDefault();

        const width = 600;
        const height = 600;
        const top = (screen.availHeight - height) / 2;
        const left = (screen.availWidth - width) / 2;

        window.open('', 'sdcpDonatePopup', `width=${width},height=${height},top=${top},left=${left}`);
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
