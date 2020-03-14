const devConfig = {
    environment: 'dev',
    stripeKey: 'pk_test_f2pBW8S36KI3jielImS2Odg2'
};
const prodConfig = {
    environment: 'prod',
    stripeKey: 'pk_live_mnRjCTNhog7LSLemgyxoS5nm'
};
const config = {
    saleStartDate: moment('2020-03-13T00:00:00-07:00', moment.ISO_8601).toDate(),
    eventEndDate: moment('2020-05-15T22:00:00-07:00', moment.ISO_8601).toDate()
};
Object.assign(config, devConfig);
