import { UserRepo } from "../repo/userRepo.js";
import { EquipmentRepo } from "../repo/equipmentRepo.js";
import { LoanRequestRepo } from "../repo/loanRequestRepo.js";
import { LoanRepo } from "../repo/loanRepo.js";
import { FineRepo } from "../repo/fineRepo.js";

export class StorageFactory {
  static createRepo(type) {
    switch (type) {
      case "user": return new UserRepo();
      case "equipment": return new EquipmentRepo();
      case "loanRequest": return new LoanRequestRepo();
      case "loan": return new LoanRepo();
      case "fine": return new FineRepo();
      default: throw new Error(`Unknown repo type: ${type}`);
    }
  }
}

