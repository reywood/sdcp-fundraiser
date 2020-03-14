$(() => {
    $('.twitter-share-btn').on('click', (e) => {
        e.preventDefault();

        const width = 600;
        const height = 250;
        const top = (screen.availHeight - height) / 2;
        const left = (screen.availWidth - width) / 2;

        window.open(
            e.target.href,
            'twitterShare',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        gtag && gtag('event', 'Share on Twitter');
    });
});
