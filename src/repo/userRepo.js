import { InMemoryRepository } from "./repository.js";

export class UserRepo extends InMemoryRepository {
  findByEmail(email) {
    return this.list().find(u => u.email === email) || null;
  }
}

