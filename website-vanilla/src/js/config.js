const devConfig = {
    environment: 'dev',
    stripeKey: 'pk_test_f2pBW8S36KI3jielImS2Odg2'
};
const prodConfig = {
    environment: 'prod',
    stripeKey: 'pk_live_mnRjCTNhog7LSLemgyxoS5nm'
};
const config = {
    saleStartDate: moment('2022-03-13T00:00:00-07:00', moment.ISO_8601).toDate(),

    // June 9, 2022 6:00pm -0700
    eventStartDate: moment('2022-06-09T18:00:00-07:00', moment.ISO_8601).toDate(),
    eventEndDate: moment('2022-06-09T21:00:00-07:00', moment.ISO_8601).toDate()
};
Object.assign(config, prodConfig);
