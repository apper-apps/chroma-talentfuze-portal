import React, { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SkillRating from "@/components/molecules/SkillRating";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";
import { vaProfileService } from "@/services/api/vaProfileService";

const VAProfileForm = ({ profile, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    experience: profile?.experience || "entry",
    salaryExpectation: profile?.salaryExpectation || "",
    discType: profile?.discType || "",
    portfolioUrls: profile?.portfolioUrls || [""],
    skills: profile?.skills || {}
  });
  
  const discTypes = [
    { value: "D", label: "Dominance - Direct, decisive, problem-solver" },
    { value: "I", label: "Influence - Outgoing, enthusiastic, people-focused" },
    { value: "S", label: "Steadiness - Patient, reliable, team-player" },
    { value: "C", label: "Conscientiousness - Analytical, detail-oriented, systematic" }
  ];
  
  const skillCategories = {
    "Marketing & Sales": [
      "Social Media Management", "Content Creation", "Email Marketing",
      "SEO", "Google Ads", "Facebook Ads", "Lead Generation", "Copywriting"
    ],
    "Administrative": [
      "Data Entry", "Virtual Assistance", "Customer Support",
      "Administrative Tasks", "Project Management", "Research"
    ],
    "Creative & Design": [
      "Graphic Design", "Video Editing", "WordPress",
      "Web Design", "Photography", "UI/UX Design"
    ],
    "Technical": [
      "Shopify", "Amazon FBA", "Bookkeeping",
      "CRM Management", "Analytics", "Automation"
    ]
  };
  
  const allSkills = Object.values(skillCategories).flat();
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePortfolioChange = (index, value) => {
    const newPortfolioUrls = [...formData.portfolioUrls];
    newPortfolioUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      portfolioUrls: newPortfolioUrls
    }));
  };
  
  const addPortfolioUrl = () => {
    setFormData(prev => ({
      ...prev,
      portfolioUrls: [...prev.portfolioUrls, ""]
    }));
  };
  
  const removePortfolioUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      portfolioUrls: prev.portfolioUrls.filter((_, i) => i !== index)
    }));
  };
  
  const handleSkillRating = (skill, rating) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: rating
      }
    }));
  };
  
  const calculateCompletionPercentage = () => {
    const requiredFields = ['name', 'email', 'experience', 'salaryExpectation', 'discType'];
    const filledFields = requiredFields.filter(field => formData[field]).length;
    const hasSkills = Object.keys(formData.skills).length > 0;
    const hasPortfolio = formData.portfolioUrls.some(url => url.trim());
    
    let total = requiredFields.length;
    let filled = filledFields;
    
    if (hasSkills) filled += 1;
    total += 1;
    
    if (hasPortfolio) filled += 1;
    total += 1;
    
    return Math.round((filled / total) * 100);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const profileData = {
        ...formData,
        salaryExpectation: parseInt(formData.salaryExpectation),
        portfolioUrls: formData.portfolioUrls.filter(url => url.trim()),
        completionStatus: calculateCompletionPercentage()
      };
      
      const savedProfile = await vaProfileService.update("va-1", profileData);
      toast.success("Profile updated successfully!");
      
      if (onSave) {
        onSave(savedProfile);
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const completionPercentage = calculateCompletionPercentage();
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-secondary">
          Complete Your VA Profile
        </h1>
        <p className="text-gray-600 mt-1">
          Help clients find you by showcasing your skills and experience
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary">Profile Completion</span>
            <span className="text-sm font-bold gradient-text">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} color="accent" />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
            <FormField
              label="Experience Level"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5+ years)</option>
              </select>
            </FormField>
            <FormField
              label="Salary Expectation (USD/month)"
              name="salaryExpectation"
              type="number"
              value={formData.salaryExpectation}
              onChange={handleInputChange}
              placeholder="1200"
              required
            />
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">DISC Personality Type</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select the personality type that best describes you. This helps clients understand your work style.
          </p>
          <div className="space-y-3">
            {discTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-primary/50 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="radio"
                  name="discType"
                  value={type.value}
                  checked={formData.discType === type.value}
                  onChange={handleInputChange}
                  className="mt-1 text-primary focus:ring-primary/50"
                />
                <div>
                  <div className="font-medium text-secondary">{type.value} - {type.label.split(' - ')[0]}</div>
                  <div className="text-sm text-gray-600">{type.label.split(' - ')[1]}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Portfolio Links</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add links to your work samples, portfolio website, or relevant profiles.
          </p>
          <div className="space-y-3">
            {formData.portfolioUrls.map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FormField
                  label={`Portfolio Link ${index + 1}`}
                  value={url}
                  onChange={(e) => handlePortfolioChange(index, e.target.value)}
                  placeholder="https://your-portfolio.com"
                  className="flex-1"
                />
                {formData.portfolioUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePortfolioUrl(index)}
                    className="mt-6"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addPortfolioUrl}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Another Link
            </Button>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold text-secondary mb-4">Skills Assessment</h2>
          <p className="text-sm text-gray-600 mb-4">
            Rate your proficiency level for each skill (1 = Beginner, 5 = Expert).
          </p>
          {Object.entries(skillCategories).map(([category, skills]) => (
            <div key={category} className="mb-6">
              <h3 className="font-medium text-secondary mb-3">{category}</h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <SkillRating
                    key={skill}
                    skill={skill}
                    rating={formData.skills[skill] || 0}
                    onRatingChange={(rating) => handleSkillRating(skill, rating)}
                  />
                ))}
              </div>
            </div>
          ))}
        </Card>
        
        <div className="flex items-center justify-end space-x-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VAProfileForm;