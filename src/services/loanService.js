import { Loan, LoanStatus } from "../domain/loan.js";

export class LoanService {
  constructor(loanRepo, availabilityService, notificationService, dueDateStrategy) {
    this.loanRepo = loanRepo;
    this.availabilityService = availabilityService;
    this.notificationService = notificationService;
    this.dueDateStrategy = dueDateStrategy;
  }

  createLoanFromRequest(request, student, equipment) {
    const start = request.startDate;
    const due = this.dueDateStrategy.calculate(start, { category: equipment.category });

    const loan = new Loan(
      `loan-${Date.now()}`,
      request.studentId,
      request.equipmentId,
      start,
      due
    );

    this.loanRepo.add(loan);
    this.availabilityService.markLoaned(request.equipmentId);
    this.notificationService.send(student, `Loan approved. Due: ${due.toDateString()}`);
    return loan;
  }

  returnLoan(loanId, student, staff) {
    const loan = this.loanRepo.getById(loanId);
    if (!loan || loan.status !== LoanStatus.ACTIVE && loan.status !== LoanStatus.OVERDUE) {
      throw new Error("Invalid loan");
    }

    loan.returnedAt = new Date();
    loan.status = LoanStatus.CLOSED;
    this.loanRepo.update(loan);

    this.availabilityService.markAvailable(loan.equipmentId);
    this.notificationService.send(student, "Return received");
    this.notificationService.send(staff, "Item available again");

    return loan;
  }
}

