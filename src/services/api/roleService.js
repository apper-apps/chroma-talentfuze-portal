import rolesData from "@/services/mockData/roles.json";

class RoleService {
  constructor() {
    this.roles = [...rolesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.roles];
  }

  async getById(id) {
    await this.delay(200);
    const role = this.roles.find(r => r.Id === id);
    if (!role) {
      throw new Error("Role not found");
    }
    return { ...role };
  }

  async create(roleData) {
    await this.delay(400);
    const newRole = {
      Id: Math.max(...this.roles.map(r => r.Id)) + 1,
      ...roleData,
      createdAt: new Date().toISOString()
    };
    this.roles.push(newRole);
    return { ...newRole };
  }

  async update(id, roleData) {
    await this.delay(400);
    const index = this.roles.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Role not found");
    }
    this.roles[index] = { ...this.roles[index], ...roleData };
    return { ...this.roles[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.roles.findIndex(r => r.Id === id);
    if (index === -1) {
      throw new Error("Role not found");
    }
    this.roles.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const roleService = new RoleService();