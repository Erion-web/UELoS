export class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  async payFine(student, fineId, cardToken) {
    return this.paymentService.payFine(fineId, student, cardToken);
  }
}

