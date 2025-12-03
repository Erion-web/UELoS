export const LoanRequestStatus = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected"
};

export class LoanRequest {
  constructor(id, studentId, equipmentId, startDate, endDate, status = LoanRequestStatus.PENDING, createdAt = new Date()) {
    this.id = id;
    this.studentId = studentId;
    this.equipmentId = equipmentId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.createdAt = createdAt;
  }
}

