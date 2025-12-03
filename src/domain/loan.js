export const LoanStatus = {
  ACTIVE: "Active",
  CLOSED: "Closed",
  OVERDUE: "Overdue"
};

export class Loan {
  constructor(id, studentId, equipmentId, startDate, dueDate, returnedAt = null, status = LoanStatus.ACTIVE) {
    this.id = id;
    this.studentId = studentId;
    this.equipmentId = equipmentId;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.returnedAt = returnedAt;
    this.status = status;
  }
}

