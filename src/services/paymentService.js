import { FineStatus } from "../domain/fine.js";

export class PaymentService {
  constructor(fineRepo, notificationService, paymentGateway) {
    this.fineRepo = fineRepo;
    this.notificationService = notificationService;
    this.paymentGateway = paymentGateway;
  }

  async payFine(fineId, student, cardToken) {
    const fine = this.fineRepo.getById(fineId);
    if (!fine) throw new Error("Fine not found");
    if (fine.status === FineStatus.PAID) {
      throw new Error("Nothing to pay");
    }

    const result = await this.paymentGateway.charge(fine.amountCents, "EUR", cardToken);

    fine.status = FineStatus.PAID;
    fine.paidAt = new Date();
    this.fineRepo.update(fine);

    this.notificationService.send(
      student,
      `Fine paid successfully. Ref: ${result.providerRef}`
    );

    return { fine, providerRef: result.providerRef };
  }
}

