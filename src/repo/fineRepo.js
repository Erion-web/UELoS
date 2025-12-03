import { InMemoryRepository } from "./repository.js";
import { FineStatus } from "../domain/fine.js";

export class FineRepo extends InMemoryRepository {
  listUnpaid() {
    return this.list().filter(f => f.status === FineStatus.UNPAID);
  }
}

