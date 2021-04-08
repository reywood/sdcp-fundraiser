window.fbAsyncInit = function() {
    FB.init({
        appId: '1784939915147073',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.12'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id) {
    if (d.getElementById(id)) {
        return;
    }
    const fjs = d.getElementsByTagName(s)[0];
    const js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

$(() => {
    const shareUrl = $('meta[property="og:url"]').attr('content');
    $('#fb-share-btn').on('click', () => {
        try {
            FB.ui(
                {
                    method: 'share',
                    href: shareUrl
                },
                function(response) {}
            );
        } catch (error) {
            console.log('Unable to open FB share', error);
            window.open('https://facebook.com/', '_blank');
        }

        gtag && gtag('event', 'Share on Facebook');
    });
});
