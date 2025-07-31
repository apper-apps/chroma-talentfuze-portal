class VATrainingService {
  constructor() {
    this.tableName = 'va_training';
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy', 'vaId'];
  }

  // Initialize ApperClient
  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  // Convert lookup fields for create/update operations
  prepareLookupFields(data) {
    const prepared = {...data};
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        prepared[fieldName] = parseInt(
          prepared[fieldName]?.Id || prepared[fieldName]
        );
      }
    });
    return prepared;
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "courseTitle" } },
          { field: { Name: "provider" } },
          { field: { Name: "status" } },
          { field: { Name: "completionDate" } },
          { field: { Name: "duration" } },
          { field: { Name: "certificateUrl" } },
          { field: { Name: "skills" } },
          { field: { Name: "startDate" } },
          { field: { Name: "progress" } },
          { field: { Name: "vaId" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching VA training records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "courseTitle" } },
          { field: { Name: "provider" } },
          { field: { Name: "status" } },
          { field: { Name: "completionDate" } },
          { field: { Name: "duration" } },
          { field: { Name: "certificateUrl" } },
          { field: { Name: "skills" } },
          { field: { Name: "startDate" } },
          { field: { Name: "progress" } },
          { field: { Name: "vaId" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching VA training with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getByVAId(vaId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "courseTitle" } },
          { field: { Name: "provider" } },
          { field: { Name: "status" } },
          { field: { Name: "completionDate" } },
          { field: { Name: "duration" } },
          { field: { Name: "certificateUrl" } },
          { field: { Name: "skills" } },
          { field: { Name: "startDate" } },
          { field: { Name: "progress" } },
          { field: { Name: "vaId" } }
        ],
        where: [
          {
            FieldName: "vaId",
            Operator: "EqualTo",
            Values: [parseInt(vaId)]
          }
        ],
        orderBy: [
          { fieldName: "completionDate", sorttype: "DESC" },
          { fieldName: "startDate", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching VA training by VA ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(trainingData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for create
      const updateableData = {
        Name: trainingData.Name || trainingData.courseTitle,
        Tags: trainingData.Tags || '',
        courseTitle: trainingData.courseTitle,
        provider: trainingData.provider,
        status: trainingData.status || 'enrolled',
        completionDate: trainingData.completionDate,
        duration: parseInt(trainingData.duration),
        certificateUrl: trainingData.certificateUrl || '',
        skills: Array.isArray(trainingData.skills) ? trainingData.skills.join(',') : trainingData.skills,
        startDate: trainingData.startDate,
        progress: parseInt(trainingData.progress || 0),
        vaId: parseInt(trainingData.vaId)
      };

      const preparedData = this.prepareLookupFields(updateableData);
      
      const params = {
        records: [preparedData]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create VA training ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating VA training:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, trainingData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for update
      const updateableData = {
        Id: parseInt(id),
        Name: trainingData.Name || trainingData.courseTitle,
        Tags: trainingData.Tags || '',
        courseTitle: trainingData.courseTitle,
        provider: trainingData.provider,
        status: trainingData.status,
        completionDate: trainingData.completionDate,
        duration: parseInt(trainingData.duration),
        certificateUrl: trainingData.certificateUrl || '',
        skills: Array.isArray(trainingData.skills) ? trainingData.skills.join(',') : trainingData.skills,
        startDate: trainingData.startDate,
        progress: parseInt(trainingData.progress || 0),
        vaId: parseInt(trainingData.vaId)
      };

      const preparedData = this.prepareLookupFields(updateableData);
      
      const params = {
        records: [preparedData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update VA training ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        const successfulRecords = response.results.filter(result => result.success);
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating VA training:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete VA training ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting VA training:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getTrainingOpportunities() {
    // Mock implementation for training opportunities
    // In a real application, this might come from another table or external API
    return [
      {
        Id: 'opp-1',
        courseTitle: 'Advanced CRM Management',
        provider: 'TalentFuze Academy',
        duration: 16,
        skills: ['CRM Management', 'Sales Process', 'Customer Relations'],
        level: 'intermediate',
        available: true
      },
      {
        Id: 'opp-2',
        courseTitle: 'Digital Marketing Mastery',
        provider: 'Marketing Institute',
        duration: 24,
        skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
        level: 'advanced',
        available: true
      },
      {
        Id: 'opp-3',
        courseTitle: 'Project Management Fundamentals',
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