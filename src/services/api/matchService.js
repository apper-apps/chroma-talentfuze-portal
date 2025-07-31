import matchesData from "@/services/mockData/matches.json";

class MatchService {
  constructor() {
    this.matches = [...matchesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.matches];
  }

  async getById(id) {
    await this.delay(200);
    const match = this.matches.find(m => m.Id === id);
    if (!match) {
      throw new Error("Match not found");
    }
    return { ...match };
  }

async getMatchesForRole(roleId) {
    await this.delay(250);
    return this.matches.filter(m => m.roleId === parseInt(roleId)).map(m => ({ ...m }));
  }

  async getMatchesForVA(vaId) {
    await this.delay(250);
    return this.matches.filter(m => m.vaId === parseInt(vaId)).map(m => ({ ...m }));
  }

  async getMatchesForVA(vaId) {
    await this.delay(250);
    return this.matches.filter(m => m.vaId === parseInt(vaId) || m.vaId === vaId).map(m => ({ ...m }));
  }

  async create(matchData) {
    await this.delay(400);
    const newMatch = {
      Id: Math.max(...this.matches.map(m => m.Id)) + 1,
      ...matchData,
      createdAt: new Date().toISOString()
    };
    this.matches.push(newMatch);
    return { ...newMatch };
  }

  async update(id, matchData) {
    await this.delay(400);
    const index = this.matches.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Match not found");
    }
    this.matches[index] = { ...this.matches[index], ...matchData };
    return { ...this.matches[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.matches.findIndex(m => m.Id === id);
    if (index === -1) {
      throw new Error("Match not found");
    }
    this.matches.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const matchService = new MatchService();