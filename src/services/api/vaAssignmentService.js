class VAAssignmentService {
  constructor() {
    this.tableName = 'va_assignment';
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy', 'vaId', 'roleId'];
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "status" } },
          { field: { Name: "startDate" } },
          { field: { Name: "assignedTasks" } },
          { field: { Name: "weeklyHours" } },
          { field: { Name: "hourlyRate" } },
          { field: { Name: "vaId" } },
          { field: { Name: "roleId" } }
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
        console.error("Error fetching VA assignments:", error?.response?.data?.message);
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "status" } },
          { field: { Name: "startDate" } },
          { field: { Name: "assignedTasks" } },
          { field: { Name: "weeklyHours" } },
          { field: { Name: "hourlyRate" } },
          { field: { Name: "vaId" } },
          { field: { Name: "roleId" } }
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
        console.error(`Error fetching VA assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getByClientId(clientId) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "status" } },
          { field: { Name: "startDate" } },
          { field: { Name: "assignedTasks" } },
          { field: { Name: "weeklyHours" } },
          { field: { Name: "hourlyRate" } },
          { field: { Name: "vaId" } },
          { field: { Name: "roleId" } }
        ],
        where: [
          {
            FieldName: "clientId",
            Operator: "EqualTo",
            Values: [clientId]
          },
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["active"]
          }
        ],
        orderBy: [
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
        console.error("Error fetching VA assignments by client ID:", error?.response?.data?.message);
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
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "Name" } },
          { field: { Name: "clientId" } },
          { field: { Name: "status" } },
          { field: { Name: "startDate" } },
          { field: { Name: "assignedTasks" } },
          { field: { Name: "weeklyHours" } },
          { field: { Name: "hourlyRate" } },
          { field: { Name: "vaId" } },
          { field: { Name: "roleId" } }
        ],
        where: [
          {
            FieldName: "vaId",
            Operator: "EqualTo",
            Values: [parseInt(vaId)]
          },
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["active"]
          }
        ],
        orderBy: [
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
        console.error("Error fetching VA assignments by VA ID:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(assignmentData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for create
      const updateableData = {
        Tags: assignmentData.Tags || '',
        Name: assignmentData.Name || `Assignment ${Date.now()}`,
        clientId: assignmentData.clientId,
        status: assignmentData.status || 'active',
        startDate: assignmentData.startDate || new Date().toISOString(),
        assignedTasks: Array.isArray(assignmentData.assignedTasks) ? assignmentData.assignedTasks.join(',') : assignmentData.assignedTasks,
        weeklyHours: parseInt(assignmentData.weeklyHours),
        hourlyRate: parseFloat(assignmentData.hourlyRate),
        vaId: parseInt(assignmentData.vaId),
        roleId: parseInt(assignmentData.roleId)
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
          console.error(`Failed to create VA assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating VA assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      const apperClient = this.getApperClient();
      
      // Only include Updateable fields for update
      const updateableData = {
        Id: parseInt(id),
        Tags: assignmentData.Tags || '',
        Name: assignmentData.Name,
        clientId: assignmentData.clientId,
        status: assignmentData.status,
        startDate: assignmentData.startDate,
        assignedTasks: Array.isArray(assignmentData.assignedTasks) ? assignmentData.assignedTasks.join(',') : assignmentData.assignedTasks,
        weeklyHours: parseInt(assignmentData.weeklyHours),
        hourlyRate: parseFloat(assignmentData.hourlyRate),
        vaId: parseInt(assignmentData.vaId),
        roleId: parseInt(assignmentData.roleId)
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
          console.error(`Failed to update VA assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error updating VA assignment:", error?.response?.data?.message);
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
          console.error(`Failed to delete VA assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return response.results.filter(result => result.success).length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting VA assignment:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const vaAssignmentService = new VAAssignmentService();