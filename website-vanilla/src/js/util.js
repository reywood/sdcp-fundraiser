function calculateCreditCardProcessingFee(amount) {
    const fee = amount * .029 + .3;
    return Math.round(fee * 100) / 100;
}
