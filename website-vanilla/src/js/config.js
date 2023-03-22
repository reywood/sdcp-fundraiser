const devConfig = {
    environment: 'dev',
    stripeKey: 'pk_test_f2pBW8S36KI3jielImS2Odg2'
};
const prodConfig = {
    environment: 'prod',
    stripeKey: 'pk_live_mnRjCTNhog7LSLemgyxoS5nm'
};
const config = {
    saleStartDate: moment('2023-03-20T00:00:00-07:00', moment.ISO_8601).toDate(),
    saleEndDate: moment('2023-05-19T00:00:00-07:00', moment.ISO_8601).toDate(),

    // May 19, 2023 7:00pm -0700
    eventStartDate: moment('2023-05-19T19:00:00-07:00', moment.ISO_8601).toDate(),
    eventEndDate: moment('2023-05-19T22:00:00-07:00', moment.ISO_8601).toDate()
};
Object.assign(config, devConfig);
