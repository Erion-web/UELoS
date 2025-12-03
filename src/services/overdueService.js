import { LoanStatus } from "../domain/loan.js";
import { Fine } from "../domain/fine.js";

export class OverdueService {
  constructor(loanRepo, fineRepo, notificationService, finePerDayCents = 100) {
    this.loanRepo = loanRepo;
    this.fineRepo = fineRepo;
    this.notificationService = notificationService;
    this.finePerDayCents = finePerDayCents;
  }

  runDailyCheck(usersById) {
    const now = new Date();
    const activeLoans = this.loanRepo.listActive();

    for (const loan of activeLoans) {
      if (loan.dueDate < now && !loan.returnedAt) {
        // mark overdue
        loan.status = LoanStatus.OVERDUE;
        this.loanRepo.update(loan);

        const daysLate = Math.ceil((now - loan.dueDate) / (1000 * 60 * 60 * 24));
        const amount = daysLate * this.finePerDayCents;

        const fine = new Fine(`fine-${loan.id}`, loan.id, amount);
        this.fineRepo.add(fine);

        const student = usersById[loan.studentId];
        if (student) {
          this.notificationService.send(
            student,
            `Loan overdue by ${daysLate} day(s). Fine: €${(amount / 100).toFixed(2)}`
          );
        }
      }
    }
  }
}

