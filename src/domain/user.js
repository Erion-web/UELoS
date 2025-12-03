export class User {
  constructor(id, name, email, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role; // "Student" | "Staff"
  }
}

export class Student extends User {
  constructor(id, name, email) {
    super(id, name, email, "Student");
  }
}

export class Staff extends User {
  constructor(id, name, email) {
    super(id, name, email, "Staff");
  }
}

