import { InMemoryRepository } from "./repository.js";
import { LoanStatus } from "../domain/loan.js";

export class LoanRepo extends InMemoryRepository {
  listActive() {
    return this.list().filter(l => l.status === LoanStatus.ACTIVE || l.status === LoanStatus.OVERDUE);
  }
}

