class VACheckInService {
  constructor() {
    this.tableName = 'va_check_in';
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
          { field: { Name: "vaId" } },
          { field: { Name: "date" } },
          { field: { Name: "hoursWorked" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "challenges" } },
          { field: { Name: "plannedTasks" } },
          { field: { Name: "mood" } },
          { field: { Name: "productivity" } }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
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
        console.error("Error fetching VA check-ins:", error?.response?.data?.message);
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
          { field: { Name: "vaId" } },
          { field: { Name: "date" } },
          { field: { Name: "hoursWorked" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "challenges" } },
          { field: { Name: "plannedTasks" } },
          { field: { Name: "mood" } },
          { field: { Name: "productivity" } }
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
        console.error(`Error fetching VA check-in with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getByVAId(vaId, limit = null) {
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
          { field: { Name: "vaId" } },
          { field: { Name: "date" } },
          { field: { Name: "hoursWorked" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "challenges" } },
          { field: { Name: "plannedTasks" } },
          { field: { Name: "mood" } },
          { field: { Name: "productivity" } }
        ],
        where: [
          {
            FieldName: "vaId",
            Operator: "EqualTo",
            Values: [parseInt(vaId)]
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
        ],
        ...(limit && { pagingInfo: { limit, offset: 0 } })
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching VA check-ins by VA ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getRecentByVAIds(vaIds, days = 7) {
    try {
      const apperClient = this.getApperClient();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "vaId" } },
          { field: { Name: "date" } },
          { field: { Name: "hoursWorked" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "challenges" } },
          { field: { Name: "plannedTasks" } },
          { field: { Name: "mood" } },
          { field: { Name: "productivity" } }
        ],
        where: [
          {
            FieldName: "vaId",
            Operator: "ExactMatch",
            Values: vaIds.map(id => parseInt(id))
          },
          {
            FieldName: "date",
            Operator: "GreaterThanOrEqualTo",
            Values: [cutoffDate.toISOString()]
          }
        ],
        orderBy: [
          { fieldName: "date", sorttype: "DESC" }
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
        console.error("Error fetching recent VA check-ins:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getTodaysCheckIn(vaId) {
    try {
      const apperClient = this.getApperClient();
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "vaId" } },
          { field: { Name: "date" } },
          { field: { Name: "hoursWorked" } },
          { field: { Name: "tasksCompleted" } },
          { field: { Name: "challenges" } },
          { field: { Name: "plannedTasks" } },
          { field: { Name: "mood" } },
          { field: { Name: "productivity" } }
        ],
        where: [
          {
            FieldName: "vaId",
            Operator: "EqualTo",
            Values: [parseInt(vaId)]
          },
          {
            FieldName: "date",
            Operator: "StartsWith",
            Values: [today]
          }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's check-in:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(checkInData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for create
      const updateableData = {
        Name: checkInData.Name || `Check-in ${new Date().toLocaleDateString()}`,
        Tags: checkInData.Tags || '',
        vaId: parseInt(checkInData.vaId),
        date: checkInData.date || new Date().toISOString(),
        hoursWorked: parseFloat(checkInData.hoursWorked),
        tasksCompleted: Array.isArray(checkInData.tasksCompleted) ? checkInData.tasksCompleted.join(',') : checkInData.tasksCompleted,
        challenges: checkInData.challenges || '',
        plannedTasks: Array.isArray(checkInData.plannedTasks) ? checkInData.plannedTasks.join(',') : checkInData.plannedTasks,
        mood: checkInData.mood,
        productivity: parseInt(checkInData.productivity)
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
          console.error(`Failed to create VA check-in ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating VA check-in:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, checkInData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for update
      const updateableData = {
        Id: parseInt(id),
        Name: checkInData.Name,
        Tags: checkInData.Tags || '',
        vaId: parseInt(checkInData.vaId),
        date: checkInData.date,
        hoursWorked: parseFloat(checkInData.hoursWorked),
        tasksCompleted: Array.isArray(checkInData.tasksCompleted) ? checkInData.tasksCompleted.join(',') : checkInData.tasksCompleted,
        challenges: checkInData.challenges || '',
        plannedTasks: Array.isArray(checkInData.plannedTasks) ? checkInData.plannedTasks.join(',') : checkInData.plannedTasks,
        mood: checkInData.mood,
        productivity: parseInt(checkInData.productivity)
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
          console.error(`Failed to update VA check-in ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating VA check-in:", error?.response?.data?.message);
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
          console.error(`Failed to delete VA check-in ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting VA check-in:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const vaCheckInService = new VACheckInService();