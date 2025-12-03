import { Student, Staff } from "./domain/user.js";
import { Equipment } from "./domain/equipment.js";
import { StorageFactory } from "./infra/storageFactory.js";
import { AvailabilityService } from "./services/availabilityService.js";
import { NotificationService } from "./services/notificationService.js";
import { FixedDaysStrategy } from "./strategy/dueDateStrategy.js";
import { LoanService } from "./services/loanService.js";
import { OverdueService } from "./services/overdueService.js";
import { PaymentGatewayAdapter } from "./infra/paymentGatewayAdapter.js";
import { PaymentService } from "./services/paymentService.js";
import { ApprovalController } from "./controller/approvalController.js";
import { PaymentController } from "./controller/paymentController.js";

async function main() {
  console.log("=== UELoS Demo ===");

  // Factory creates repos
  const userRepo = StorageFactory.createRepo("user");
  const equipmentRepo = StorageFactory.createRepo("equipment");
  const loanRequestRepo = StorageFactory.createRepo("loanRequest");
  const loanRepo = StorageFactory.createRepo("loan");
  const fineRepo = StorageFactory.createRepo("fine");

  // Sample users
  const alice = new Student("u1", "Alice", "alice@u.edu");
  const bob = new Staff("u2", "Bob", "bob@u.edu");
  userRepo.add(alice);
  userRepo.add(bob);

  // Sample equipment
  const camera = new Equipment("e1", "Canon Camera", "Media");
  equipmentRepo.add(camera);

  const usersById = {
    [alice.id]: alice,
    [bob.id]: bob
  };

  // Services
  const availabilityService = new AvailabilityService(equipmentRepo);
  const notificationService = new NotificationService();
  const dueStrategy = new FixedDaysStrategy(); //  policy.maxDays used inside
  // simple fake policy for 7 days
  const loanService = new LoanService(loanRepo, availabilityService, notificationService, {
    calculate(startDate, ctx) {
      // just delegate to fixed strategy with maxDays = 7
      return dueStrategy.calculate(startDate, { maxDays: 7, ...ctx });
    }
  });
  const overdueService = new OverdueService(loanRepo, fineRepo, notificationService);
  const paymentGateway = new PaymentGatewayAdapter();
  const paymentService = new PaymentService(fineRepo, notificationService, paymentGateway);

  // Controllers
  const approvalController = new ApprovalController(
    loanRequestRepo,
    availabilityService,
    loanService,
    notificationService,
    usersById
  );
  const paymentController = new PaymentController(paymentService);

  // 1) Student submits request
  const startDate = new Date();
  const request = approvalController.submitRequest(alice.id, camera.id, startDate);
  console.log("Request created:", request);

  // 2) Staff approves and loan is created
  const loan = loanService.createLoanFromRequest(request, alice, camera);
  console.log("Loan created:", loan);

  // 3) Simulate overdue by moving dueDate to past
  loan.dueDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
  loanRepo.update(loan);

  // 4) Run overdue check – creates fine
  overdueService.runDailyCheck(usersById);
  const fines = fineRepo.list();
  console.log("Fines:", fines);

  // 5) Student pays fine
  if (fines.length > 0) {
    await paymentController.payFine(alice, fines[0].id, "fake-card-token");
  }

  console.log("=== Demo Finished ===");
}

main().catch(err => console.error(err));

