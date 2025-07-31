class MatchService {
  constructor() {
    this.tableName = 'match';
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy', 'roleId', 'vaId'];
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
    const prepared = { ...data };
    const lookupFields = ['roleId', 'vaId', 'Owner', 'CreatedBy', 'ModifiedBy'];
    
lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        // Handle both object and direct ID inputs
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
          { field: { Name: "matchScore" } },
          { field: { Name: "matchFactors" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "roleId" } },
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
        console.error("Error fetching matches:", error?.response?.data?.message);
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
          { field: { Name: "matchScore" } },
          { field: { Name: "matchFactors" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "roleId" } },
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
        console.error(`Error fetching match with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getMatchesForRole(roleId) {
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
          { field: { Name: "matchScore" } },
          { field: { Name: "matchFactors" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "roleId" } },
          { field: { Name: "vaId" } }
        ],
        where: [
          {
            FieldName: "roleId",
            Operator: "EqualTo",
            Values: [parseInt(roleId)]
          }
        ],
        orderBy: [
          { fieldName: "matchScore", sorttype: "DESC" }
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
        console.error("Error fetching matches for role:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getMatchesForVA(vaId) {
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
          { field: { Name: "matchScore" } },
          { field: { Name: "matchFactors" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "roleId" } },
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
          { fieldName: "matchScore", sorttype: "DESC" }
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
        console.error("Error fetching matches for VA:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(matchData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for create
      const updateableData = {
        Name: matchData.Name || `Match ${Date.now()}`,
        Tags: matchData.Tags || '',
        matchScore: parseInt(matchData.matchScore),
        matchFactors: typeof matchData.matchFactors === 'object' ? JSON.stringify(matchData.matchFactors) : matchData.matchFactors,
        status: matchData.status || 'pending',
        createdAt: new Date().toISOString(),
        roleId: parseInt(matchData.roleId),
        vaId: parseInt(matchData.vaId)
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
          console.error(`Failed to create match ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating match:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, matchData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for update
      const updateableData = {
        Id: parseInt(id),
        Name: matchData.Name,
        Tags: matchData.Tags || '',
        matchScore: parseInt(matchData.matchScore),
        matchFactors: typeof matchData.matchFactors === 'object' ? JSON.stringify(matchData.matchFactors) : matchData.matchFactors,
        status: matchData.status,
        createdAt: matchData.createdAt,
        roleId: parseInt(matchData.roleId),
        vaId: parseInt(matchData.vaId)
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
          console.error(`Failed to update match ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating match:", error?.response?.data?.message);
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
          console.error(`Failed to delete match ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting match:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const matchService = new MatchService();