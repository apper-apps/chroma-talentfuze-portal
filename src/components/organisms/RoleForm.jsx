import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { roleService } from "@/services/api/roleService";

const RoleForm = ({ role, isEditing = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: role?.title || "",
    salaryMin: role?.salaryMin || "",
    salaryMax: role?.salaryMax || "",
    experienceLevel: role?.experienceLevel || "entry",
    description: role?.description || "",
    requiredSkills: role?.requiredSkills || []
  });
  const [newSkill, setNewSkill] = useState("");
  
  const skillSuggestions = [
    "Social Media Management", "Content Creation", "Email Marketing", 
    "Customer Support", "Data Entry", "Virtual Assistance",
    "Graphic Design", "Video Editing", "SEO", "Google Ads",
    "Facebook Ads", "Copywriting", "Lead Generation", "Research",
    "Administrative Tasks", "Project Management", "WordPress",
    "Shopify", "Amazon FBA", "Bookkeeping"
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addSkill = (skill) => {
    if (skill && !formData.requiredSkills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill]
      }));
      setNewSkill("");
    }
  };
  
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const roleData = {
        ...formData,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
        status: "active",
        clientId: "client-1"
      };
      
      if (isEditing) {
        await roleService.update(role.Id, roleData);
        toast.success("Role updated successfully!");
      } else {
        await roleService.create(roleData);
        toast.success("Role created successfully!");
      }
      
      navigate("/roles");
    } catch (error) {
      toast.error("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-secondary">
            {isEditing ? "Edit Role" : "Create New Role"}
          </h1>
          <p className="text-gray-600 mt-1">
            Define your requirements to find the perfect virtual assistant
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/roles")}>
          <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
          Back to Roles
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Role Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Social Media Manager"
              required
            />
            <FormField
              label="Experience Level"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              required
            >
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleInputChange}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
            </FormField>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Compensation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Minimum Salary (USD/month)"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleInputChange}
              placeholder="500"
              required
            />
            <FormField
              label="Maximum Salary (USD/month)"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleInputChange}
              placeholder="1500"
              required
            />
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Required Skills</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="primary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(newSkill);
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => addSkill(newSkill)}
              >
                Add
              </Button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Suggested skills:</p>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions
                  .filter(skill => !formData.requiredSkills.includes(skill))
                  .slice(0, 10)
                  .map((skill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Job Description</h2>
          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
            required
          >
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-secondary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-vertical"
              placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
              required
            />
          </FormField>
        </Card>
        
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/roles")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {isEditing ? "Update Role" : "Create Role"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;