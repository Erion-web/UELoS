// Simple in-memory base repository (Pure Fabrication)
export class InMemoryRepository {
  constructor() {
    this.items = new Map(); // id -> entity
  }

  add(entity) {
    this.items.set(entity.id, entity);
    return entity;
  }

  getById(id) {
    return this.items.get(id) || null;
  }

  list() {
    return Array.from(this.items.values());
  }

  update(entity) {
    if (!this.items.has(entity.id)) throw new Error("Entity not found");
    this.items.set(entity.id, entity);
    return entity;
  }
}

