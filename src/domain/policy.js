export class Policy {
  constructor(id, name, maxDays, allowedCategories = []) {
    this.id = id;
    this.name = name;
    this.maxDays = maxDays;
    this.allowedCategories = allowedCategories;
  }
}

