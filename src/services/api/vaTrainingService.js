import vaTrainingData from '@/services/mockData/vaTraining.json';

class VATrainingService {
  constructor() {
    this.trainings = [...vaTrainingData];
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay(200);
    return this.trainings.map(training => ({ ...training }));
  }

  async getById(id) {
    await this.delay(150);
    const training = this.trainings.find(t => t.Id === parseInt(id));
    if (!training) {
      throw new Error("Training record not found");
    }
    return { ...training };
  }

  async getByVAId(vaId) {
    await this.delay(200);
    return this.trainings
      .filter(t => t.vaId === parseInt(vaId))
      .map(t => ({ ...t }))
      .sort((a, b) => new Date(b.completionDate || b.startDate) - new Date(a.completionDate || a.startDate));
  }

  async create(trainingData) {
    await this.delay(300);
    const newTraining = {
      Id: Math.max(...this.trainings.map(t => t.Id), 0) + 1,
      ...trainingData
    };
    this.trainings.push(newTraining);
    return { ...newTraining };
  }

  async update(id, trainingData) {
    await this.delay(250);
    const index = this.trainings.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Training record not found");
    }
    
    this.trainings[index] = {
      ...this.trainings[index],
      ...trainingData,
      Id: parseInt(id)
    };
    
    return { ...this.trainings[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.trainings.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Training record not found");
    }
    
    this.trainings.splice(index, 1);
    return true;
  }

  async getTrainingOpportunities() {
    await this.delay(200);
    return [
      {
        Id: 'opp-1',
        title: 'Advanced CRM Management',
        provider: 'TalentFuze Academy',
        duration: 16,
        skills: ['CRM Management', 'Sales Process', 'Customer Relations'],
        level: 'intermediate',
        available: true
      },
      {
        Id: 'opp-2',
        title: 'Digital Marketing Mastery',
        provider: 'Marketing Institute',
        duration: 24,
        skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
        level: 'advanced',
        available: true
      },
      {
        Id: 'opp-3',
        title: 'Project Management Fundamentals',
        provider: 'Professional Development Corp',
        duration: 20,
        skills: ['Project Management', 'Team Leadership', 'Planning'],
        level: 'beginner',
        available: true
      }
    ];
  }
}

export const vaTrainingService = new VATrainingService();