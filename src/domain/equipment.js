export const EquipmentStatus = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  LOANED: "Loaned"
};

export class Equipment {
  constructor(id, name, category, status = EquipmentStatus.AVAILABLE) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.status = status;
  }
}

