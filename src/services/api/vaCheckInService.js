import vaCheckInsData from '@/services/mockData/vaCheckIns.json';

class VACheckInService {
  constructor() {
    this.checkIns = [...vaCheckInsData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(200);
    return this.checkIns.map(checkIn => ({ ...checkIn }));
  }

  async getById(id) {
    await this.delay(150);
    const checkIn = this.checkIns.find(c => c.Id === parseInt(id));
    if (!checkIn) {
      throw new Error("Check-in not found");
    }
    return { ...checkIn };
  }

  async getByVAId(vaId, limit = null) {
    await this.delay(200);
    let checkIns = this.checkIns
      .filter(c => c.vaId === parseInt(vaId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (limit) {
      checkIns = checkIns.slice(0, limit);
    }
    
    return checkIns.map(c => ({ ...c }));
  }

  async getRecentByVAIds(vaIds, days = 7) {
    await this.delay(200);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.checkIns
      .filter(c => vaIds.includes(c.vaId) && new Date(c.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(c => ({ ...c }));
  }

  async getTodaysCheckIn(vaId) {
    await this.delay(150);
    const today = new Date().toISOString().split('T')[0];
    const checkIn = this.checkIns.find(c => 
      c.vaId === parseInt(vaId) && 
      c.date.startsWith(today)
    );
    return checkIn ? { ...checkIn } : null;
  }

  async create(checkInData) {
    await this.delay(300);
    const newCheckIn = {
      Id: Math.max(...this.checkIns.map(c => c.Id), 0) + 1,
      ...checkInData,
      date: new Date().toISOString()
    };
    this.checkIns.push(newCheckIn);
    return { ...newCheckIn };
  }

  async update(id, checkInData) {
    await this.delay(250);
    const index = this.checkIns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Check-in not found");
    }
    
    this.checkIns[index] = {
      ...this.checkIns[index],
      ...checkInData,
      Id: parseInt(id)
    };
    
    return { ...this.checkIns[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.checkIns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Check-in not found");
    }
    
    this.checkIns.splice(index, 1);
    return true;
  }
}

export const vaCheckInService = new VACheckInService();