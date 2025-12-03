// Adapter over a (fake) payment gateway
export class PaymentGatewayAdapter {
  async charge(amountCents, currency, cardToken) {
    console.log(`[GATEWAY] Charging ${currency} ${(amountCents / 100).toFixed(2)} with token ${cardToken}`);
    // Simulate success
    return { providerRef: "fake-tx-" + Date.now() };
  }
}

