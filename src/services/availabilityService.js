import { EquipmentStatus } from "../domain/equipment.js";

export class AvailabilityService {
  constructor(equipmentRepo) {
    this.equipmentRepo = equipmentRepo;
  }

  isAvailable(equipmentId) {
    const eq = this.equipmentRepo.getById(equipmentId);
    return eq && eq.status === EquipmentStatus.AVAILABLE;
  }

  markLoaned(equipmentId) {
    const eq = this.equipmentRepo.getById(equipmentId);
    if (!eq) throw new Error("Equipment not found");
    eq.status = EquipmentStatus.LOANED;
    this.equipmentRepo.update(eq);
  }

  markAvailable(equipmentId) {
    const eq = this.equipmentRepo.getById(equipmentId);
    if (!eq) throw new Error("Equipment not found");
    eq.status = EquipmentStatus.AVAILABLE;
    this.equipmentRepo.update(eq);
  }
}

