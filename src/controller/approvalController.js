import { LoanRequest, LoanRequestStatus } from "../domain/loanRequest.js";

export class ApprovalController {
  constructor(loanRequestRepo, availabilityService, loanService, notificationService, usersById) {
    this.loanRequestRepo = loanRequestRepo;
    this.availabilityService = availabilityService;
    this.loanService = loanService;
    this.notificationService = notificationService;
    this.usersById = usersById; // simple map for demo
  }

  submitRequest(studentId, equipmentId, startDate) {
    if (!this.availabilityService.isAvailable(equipmentId)) {
      throw new Error("Not available");
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const req = new LoanRequest(
      `req-${Date.now()}`,
      studentId,
      equipmentId,
      startDate,
      endDate
    );

    this.loanRequestRepo.add(req);
    const student = this.usersById[studentId];
    this.notificationService.send(student, "Request submitted");
    return req;
  }

  reviewRequest(staffId, requestId, decision) {
    const req = this.loanRequestRepo.getById(requestId);
    if (!req) throw new Error("Request not found");

    const student = this.usersById[req.studentId];
    const staff = this.usersById[staffId];

    if (decision === "Approve") {
      req.status = LoanRequestStatus.APPROVED;
      this.loanRequestRepo.update(req);

      const equipment = staff && staff; // just to avoid eslint – we get equipment separately
      // In reality you'd fetch equipment from repo; for demo we pass it from caller
    } else {
      req.status = LoanRequestStatus.REJECTED;
      this.loanRequestRepo.update(req);
      this.notificationService.send(student, "Request rejected");
    }
  }

  // Helper to approve and create loan (kept separate for clarity)
  approveAndCreateLoan(staffId, requestId, equipment, loanService) {
    const req = this.loanRequestRepo.getById(requestId);
    if (!req) throw new Error("Request not found");

    req.status = LoanRequestStatus.APPROVED;
    this.loanRequestRepo.update(req);

    const student = this.usersById[req.studentId];
    const staff = this.usersById[staffId];

    const loan = loanService.createLoanFromRequest(req, student, equipment);
    this.notificationService.send(staff, `Loan created for request ${req.id}`);
    return loan;
  }
}

