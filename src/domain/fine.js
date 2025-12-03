export const FineStatus = {
  UNPAID: "Unpaid",
  PAID: "Paid"
};

export class Fine {
  constructor(id, loanId, amountCents, status = FineStatus.UNPAID, paidAt = null) {
    this.id = id;
    this.loanId = loanId;
    this.amountCents = amountCents;
    this.status = status;
    this.paidAt = paidAt;
  }
}

