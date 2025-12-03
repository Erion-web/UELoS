// Strategy interface
export class DueDateStrategy {
  calculate(startDate, policyOrCtx) {
    throw new Error("Not implemented");
  }
}

// Fixed number of days
export class FixedDaysStrategy extends DueDateStrategy {
  calculate(startDate, policy) {
    const result = new Date(startDate);
    result.setDate(result.getDate() + policy.maxDays);
    return result;
  }
}

// Category-based (different policies per equipment category)
export class CategoryBasedStrategy extends DueDateStrategy {
  constructor(categoryPolicies) {
    super();
    this.categoryPolicies = categoryPolicies; // category -> maxDays
  }

  calculate(startDate, ctx) {
    const { category } = ctx;
    const days = this.categoryPolicies[category] ?? 7;
    const result = new Date(startDate);
    result.setDate(result.getDate() + days);
    return result;
  }
}

