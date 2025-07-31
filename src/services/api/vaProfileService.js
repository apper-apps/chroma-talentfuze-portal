class VAProfileService {
  constructor() {
    this.tableName = 'va_profile';
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy'];
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
          { field: { Name: "email" } },
          { field: { Name: "resumeUrl" } },
          { field: { Name: "portfolioUrls" } },
          { field: { Name: "skills" } },
          { field: { Name: "discType" } },
          { field: { Name: "experience" } },
          { field: { Name: "salaryExpectation" } },
          { field: { Name: "completionStatus" } }
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
        console.error("Error fetching VA profiles:", error?.response?.data?.message);
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
          { field: { Name: "email" } },
          { field: { Name: "resumeUrl" } },
          { field: { Name: "portfolioUrls" } },
          { field: { Name: "skills" } },
          { field: { Name: "discType" } },
          { field: { Name: "experience" } },
          { field: { Name: "salaryExpectation" } },
          { field: { Name: "completionStatus" } }
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
        console.error(`Error fetching VA profile with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(profileData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for create
      const updateableData = {
        Name: profileData.Name || profileData.name,
        Tags: profileData.Tags || '',
        email: profileData.email,
        resumeUrl: profileData.resumeUrl || '',
        portfolioUrls: Array.isArray(profileData.portfolioUrls) ? profileData.portfolioUrls.join('\n') : profileData.portfolioUrls,
        skills: typeof profileData.skills === 'object' ? JSON.stringify(profileData.skills) : profileData.skills,
        discType: profileData.discType,
        experience: profileData.experience,
        salaryExpectation: parseInt(profileData.salaryExpectation),
        completionStatus: parseInt(profileData.completionStatus || 0)
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
          console.error(`Failed to create VA profile ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating VA profile:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, profileData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for update
      const updateableData = {
        Id: parseInt(id),
        Name: profileData.Name || profileData.name,
        Tags: profileData.Tags || '',
        email: profileData.email,
        resumeUrl: profileData.resumeUrl || '',
        portfolioUrls: Array.isArray(profileData.portfolioUrls) ? profileData.portfolioUrls.join('\n') : profileData.portfolioUrls,
        skills: typeof profileData.skills === 'object' ? JSON.stringify(profileData.skills) : profileData.skills,
        discType: profileData.discType,
        experience: profileData.experience,
        salaryExpectation: parseInt(profileData.salaryExpectation),
        completionStatus: parseInt(profileData.completionStatus || 0)
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
          console.error(`Failed to update VA profile ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating VA profile:", error?.response?.data?.message);
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
          console.error(`Failed to delete VA profile ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting VA profile:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const vaProfileService = new VAProfileService();