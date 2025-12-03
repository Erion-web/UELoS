import { InMemoryRepository } from "./repository.js";
import { EquipmentStatus } from "../domain/equipment.js";

export class EquipmentRepo extends InMemoryRepository {
  listAvailable() {
    return this.list().filter(e => e.status === EquipmentStatus.AVAILABLE);
  }
}

