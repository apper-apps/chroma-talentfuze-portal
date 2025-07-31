import vaAssignmentsData from '@/services/mockData/vaAssignments.json';

class VAAssignmentService {
  constructor() {
    this.assignments = [...vaAssignmentsData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(200);
    return this.assignments.map(assignment => ({ ...assignment }));
  }

  async getById(id) {
    await this.delay(150);
    const assignment = this.assignments.find(a => a.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  }

  async getByClientId(clientId) {
    await this.delay(200);
    return this.assignments
      .filter(a => a.clientId === clientId && a.status === 'active')
      .map(a => ({ ...a }));
  }

  async getByVAId(vaId) {
    await this.delay(200);
    return this.assignments
      .filter(a => a.vaId === parseInt(vaId) && a.status === 'active')
      .map(a => ({ ...a }));
  }

  async create(assignmentData) {
    await this.delay(300);
    const newAssignment = {
      Id: Math.max(...this.assignments.map(a => a.Id), 0) + 1,
      ...assignmentData,
      status: 'active'
    };
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await this.delay(250);
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index] = {
      ...this.assignments[index],
      ...assignmentData,
      Id: parseInt(id)
    };
    
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments.splice(index, 1);
    return true;
  }
}

export const vaAssignmentService = new VAAssignmentService();