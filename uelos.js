// UELoS — Single-file JavaScript Skeleton (UML-aligned)
// Purpose: Provide a clean code skeleton (no server/UI) that mirrors the UML classes,
// sequence diagrams, and design patterns for the University Equipment Loan System.
// Patterns: GRASP Controller, Strategy, Factory Method, Adapter, Pure Fabrication (Repos).
// Roles: Student, Staff. All dates assumed UTC.
//
// You can split this file later, but this one-file version is ideal for submission/demo.

// =========================
// Domain Layer (Entities)
// =========================

class User {
  /** @param {string} id @param {string} name @param {string} email @param {'Student'|'Staff'} role */
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

// Inheritance: explicit subclasses for clarity with UML
class Student extends User {
  constructor(id, name, email) { super(id, name, email, 'Student'); }
}

class Staff extends User {
  constructor(id, name, email) { super(id, name, email, 'Staff'); }
}

class Equipment {
  /** @param {string} id @param {string} name @param {string} category @param {'Available'|'Reserved'|'Loaned'} status */
  constructor(id, name, category, status = 'Available') {
    this.id = id;
    this.name = name;
    this.category = category;
    this.status = status;
  }
}

class LoanRequest {
  /** @param {string} id @param {string} studentId @param {string} equipmentId
   * @param {Date} startDate @param {Date} endDate
   * @param {'Pending'|'Approved'|'Rejected'} status @param {Date} createdAt
   */
  constructor(id, studentId, equipmentId, startDate, endDate, status = 'Pending', createdAt = new Date()) {
    this.id = id;
    this.studentId = studentId;
    this.equipmentId = equipmentId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.createdAt = createdAt;
  }
}

class Loan {
  /** @param {string} id @param {string} studentId @param {string} equipmentId
   * @param {Date} startDate @param {Date} dueDate
   * @param {'Active'|'Closed'|'Overdue'} status @param {Date=} returnedAt
   */
  constructor(id, studentId, equipmentId, startDate, dueDate, status = 'Active', returnedAt = undefined) {
    this.id = id;
    this.studentId = studentId;
    this.equipmentId = equipmentId;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.status = status;
    this.returnedAt = returnedAt;
  }
}

class Fine {
  /** @param {string} id @param {string} loanId @param {number} amountCents
   * @param {'Unpaid'|'Paid'} status @param {Date} createdAt @param {Date=} paidAt @param {string=} receiptRef
   */
  constructor(id, loanId, amountCents, status = 'Unpaid', createdAt = new Date(), paidAt = undefined, receiptRef = undefined) {
    this.id = id;
    this.loanId = loanId;
    this.amountCents = amountCents;
    this.status = status;
    this.createdAt = createdAt;
    this.paidAt = paidAt;
    this.receiptRef = receiptRef;
  }
}

// =========================
// Policies (Strategy)
// =========================

class DueDateStrategy { // interface by convention
  /** @param {Date} startDate @param {Equipment} equipment @returns {Date} */
  calculate(startDate, equipment) { throw new Error('Not implemented'); }
}

class FixedDaysStrategy extends DueDateStrategy {
  constructor(days = 7) { super(); this.days = days; }
  calculate(startDate) {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + this.days);
    return d;
  }
}

class CategoryBasedStrategy extends DueDateStrategy {
  /** @param {Record<string, number>} rules e.g. { 'Camera': 3, 'Laptop': 7 } */
  constructor(rules = {}) { super(); this.rules = rules; }
  calculate(startDate, equipment) {
    const days = this.rules[equipment?.category] ?? 7;
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + days);
    return d;
  }
}

// =========================
// Ports (Abstract Interfaces)
// =========================

class Repository { /* marker */ }

class UserRepo extends Repository {
  /** @param {User} user */ add(user) { throw new Error('NI'); }
  /** @param {string} id */ getById(id) { throw new Error('NI'); }
  /** @param {string} email */ findByEmail(email) { throw new Error('NI'); }
  list() { throw new Error('NI'); }
}

class EquipmentRepo extends Repository {
  /** @param {Equipment} eq */ add(eq) { throw new Error('NI'); }
  /** @param {string} id */ getById(id) { throw new Error('NI'); }
  listAvailable() { throw new Error('NI'); }
  /** @param {string} id @param {'Available'|'Reserved'|'Loaned'} status */ updateStatus(id, status) { throw new Error('NI'); }
}

class LoanRequestRepo extends Repository {
  /** @param {LoanRequest} lr */ add(lr) { throw new Error('NI'); }
  /** @param {string} id */ getById(id) { throw new Error('NI'); }
  listPending() { throw new Error('NI'); }
  /** @param {string} id @param {'Pending'|'Approved'|'Rejected'} status */ updateStatus(id, status) { throw new Error('NI'); }
}

class LoanRepo extends Repository {
  /** @param {Loan} loan */ add(loan) { throw new Error('NI'); }
  /** @param {string} id */ getById(id) { throw new Error('NI'); }
  listActive() { throw new Error('NI'); }
  /** @param {string} id @param {Date} returnedAt */ close(id, returnedAt) { throw new Error('NI'); }
}

class FineRepo extends Repository {
  /** @param {Fine} fine */ create(fine) { throw new Error('NI'); }
  /** @param {string} loanId */ findByLoan(loanId) { throw new Error('NI'); }
  /** @param {string} fineId @param {string} receiptRef @param {Date} paidAt */ markPaid(fineId, receiptRef, paidAt) { throw new Error('NI'); }
}

class PaymentGateway {
  /** @param {{amountCents:number,currency:'EUR',cardToken:string}} opts */ charge(opts) { throw new Error('NI'); }
}

class Mailer {
  /** @param {string} to @param {string} subject @param {string} body */ send(to, subject, body) { throw new Error('NI'); }
}

// =========================
// Factory (Factory Method)
// =========================

class StorageFactory {
  /** @param {'memory'|'db'|'api'} type @returns {{user:UserRepo,equipment:EquipmentRepo,loanRequest:LoanRequestRepo,loan:LoanRepo,fine:FineRepo}} */
  static createRepo(type) {
    // In the skeleton we just declare the seam; concrete impls are out of scope.
    throw new Error('Not implemented (factory returns concrete repos per type)');
  }
}

// =========================
// Services (Application Layer)
// =========================

class AvailabilityService {
  /** @param {EquipmentRepo} equipmentRepo */
  constructor(equipmentRepo) { this.equipmentRepo = equipmentRepo; }

  /** @param {string} equipmentId @param {{start:Date,end:Date}=} period */
  async isAvailable(equipmentId, period) { // UML: isAvailable(equipmentId, range): bool
    void equipmentId; void period;
    throw new Error('Not implemented');
  }
}

// GRASP Controller for loan lifecycle
class LoanService {
  /** @param {LoanRepo} loanRepo @param {EquipmentRepo} equipmentRepo @param {DueDateStrategy} dueDateStrategy */
  constructor(loanRepo, equipmentRepo, dueDateStrategy) {
    this.loanRepo = loanRepo;
    this.equipmentRepo = equipmentRepo;
    this.dueDateStrategy = dueDateStrategy;
  }

  /** @param {LoanRequest} request */
  async createLoanFromRequest(request) {
    void request;
    // compute due via strategy → persist Loan → mark equipment Loaned
    throw new Error('Not implemented');
  }

  /** @param {string} loanId */
  async returnLoan(loanId) {
    void loanId;
    // close loan → mark equipment Available → notifications
    throw new Error('Not implemented');
  }
}

class NotificationService {
  /** @param {Mailer} mailer */ constructor(mailer) { this.mailer = mailer; }
  /** @param {string} to @param {string} message */ async send(to, message) { void to; void message; throw new Error('Not implemented'); }
}

class PaymentService {
  /** @param {FineRepo} fineRepo @param {PaymentGateway} gateway @param {Repository} receiptRepo (optional) */
  constructor(fineRepo, gateway, receiptRepo) {
    this.fineRepo = fineRepo;
    this.gateway = gateway;
    this.receiptRepo = receiptRepo;
  }
  /** @param {string} fineId @param {string} cardToken */
  async payFine(fineId, cardToken) {
    void fineId; void cardToken;
    // charge via gateway → mark fine paid → add receipt → send notification
    throw new Error('Not implemented');
  }
}

class OverdueService {
  /** @param {LoanRepo} loanRepo @param {{compute:(loan:Loan, now:Date)=>number}} finePolicy @param {FineRepo} fineRepo @param {NotificationService} notifier */
  constructor(loanRepo, finePolicy, fineRepo, notifier) {
    this.loanRepo = loanRepo; this.finePolicy = finePolicy; this.fineRepo = fineRepo; this.notifier = notifier;
  }
  async runDailyCheck(now = new Date()) {
    void now;
    // listActive → for each overdue → compute fine → create fine → notify
    throw new Error('Not implemented');
  }
}

// =========================
// Controllers (GRASP)
// =========================

class ApprovalController {
  /** @param {AvailabilityService} availability @param {LoanService} loanService @param {LoanRequestRepo} loanRequestRepo @param {NotificationService} notifier */
  constructor(availability, loanService, loanRequestRepo, notifier) {
    this.availability = availability;
    this.loanService = loanService;
    this.loanRequestRepo = loanRequestRepo;
    this.notifier = notifier;
  }

  /** submitRequest(equipmentId, studentId, start, end) */
  async submitRequest(equipmentId, studentId, start, end) {
    void equipmentId; void studentId; void start; void end;
    // check availability → add Pending request → notify
    throw new Error('Not implemented');
  }

  /** reviewRequest(requestId, decision: 'Approve'|'Reject') */
  async reviewRequest(requestId, decision) {
    void requestId; void decision;
    // get request → if Approve: create loan → update statuses; else mark Rejected → notify
    throw new Error('Not implemented');
  }
}

class PaymentController {
  /** @param {PaymentService} paymentService */ constructor(paymentService) { this.paymentService = paymentService; }
  /** payFine(fineId, cardToken) */
  async payFine(fineId, cardToken) { return this.paymentService.payFine(fineId, cardToken); }
}

// =========================
// Exports (for tests or splitting later)
// =========================

module.exports = {
  // domain
  User, Student, Staff, Equipment, LoanRequest, Loan, Fine,
  // policies
  DueDateStrategy, FixedDaysStrategy, CategoryBasedStrategy,
  // ports
  Repository, UserRepo, EquipmentRepo, LoanRequestRepo, LoanRepo, FineRepo, PaymentGateway, Mailer,
  // factory
  StorageFactory,
  // services/controllers
  AvailabilityService, LoanService, NotificationService, PaymentService, OverdueService,
  ApprovalController, PaymentController
};
