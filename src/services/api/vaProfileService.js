import vaProfilesData from "@/services/mockData/vaProfiles.json";

class VAProfileService {
  constructor() {
    this.profiles = [...vaProfilesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.profiles];
  }

  async getById(id) {
    await this.delay(200);
    const profile = this.profiles.find(p => p.Id === parseInt(id) || p.Id === id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return { ...profile };
  }

  async create(profileData) {
    await this.delay(400);
    const newProfile = {
      Id: Math.max(...this.profiles.map(p => p.Id)) + 1,
      ...profileData
    };
    this.profiles.push(newProfile);
    return { ...newProfile };
  }

  async update(id, profileData) {
    await this.delay(400);
    const index = this.profiles.findIndex(p => p.Id === parseInt(id) || p.Id === id);
    if (index === -1) {
      // If profile doesn't exist, create it
      return await this.create({ ...profileData, Id: id });
    }
    this.profiles[index] = { ...this.profiles[index], ...profileData };
    return { ...this.profiles[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.profiles.findIndex(p => p.Id === parseInt(id) || p.Id === id);
    if (index === -1) {
      throw new Error("Profile not found");
    }
    this.profiles.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const vaProfileService = new VAProfileService();