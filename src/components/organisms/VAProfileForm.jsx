import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SkillRating from "@/components/molecules/SkillRating";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";
import { vaProfileService } from "@/services/api/vaProfileService";
import { vaCheckInService } from "@/services/api/vaCheckInService";
const VAProfileForm = ({ profile, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [todaysCheckIn, setTodaysCheckIn] = useState(null);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    experience: profile?.experience || "entry",
    salaryExpectation: profile?.salaryExpectation || "",
    discType: profile?.discType || "",
    portfolioUrls: profile?.portfolioUrls || [""],
    skills: profile?.skills || {}
  });
  const [checkInData, setCheckInData] = useState({
    hoursWorked: "",
    tasksCompleted: [""],
    challenges: "",
    plannedTasks: [""],
    mood: "productive",
    productivity: 8
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
  
  useEffect(() => {
    loadTodaysCheckIn();
  }, []);
  
  const loadTodaysCheckIn = async () => {
    try {
      const checkIn = await vaCheckInService.getTodaysCheckIn(profile?.Id || 1);
      if (checkIn) {
        setTodaysCheckIn(checkIn);
        setCheckInData({
          hoursWorked: checkIn.hoursWorked.toString(),
          tasksCompleted: checkIn.tasksCompleted,
          challenges: checkIn.challenges,
          plannedTasks: checkIn.plannedTasks,
          mood: checkIn.mood,
          productivity: checkIn.productivity
        });
      }
    } catch (error) {
      // No check-in today is fine
    }
  };
  
  const handleCheckInChange = (field, value) => {
    setCheckInData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleTaskChange = (index, value, type) => {
    setCheckInData(prev => ({
      ...prev,
      [type]: prev[type].map((task, i) => i === index ? value : task)
    }));
  };
  
  const addTask = (type) => {
    setCheckInData(prev => ({
      ...prev,
      [type]: [...prev[type], ""]
    }));
  };
  
  const removeTask = (index, type) => {
    setCheckInData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };
  
  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    setCheckInLoading(true);
    
    try {
      const checkInPayload = {
        vaId: profile?.Id || 1,
        hoursWorked: parseFloat(checkInData.hoursWorked),
        tasksCompleted: checkInData.tasksCompleted.filter(task => task.trim()),
        challenges: checkInData.challenges,
        plannedTasks: checkInData.plannedTasks.filter(task => task.trim()),
        mood: checkInData.mood,
        productivity: checkInData.productivity
      };
      
      if (todaysCheckIn) {
        await vaCheckInService.update(todaysCheckIn.Id, checkInPayload);
        toast.success("Daily check-in updated successfully!");
      } else {
        const savedCheckIn = await vaCheckInService.create(checkInPayload);
        setTodaysCheckIn(savedCheckIn);
        toast.success("Daily check-in submitted successfully!");
      }
    } catch (error) {
      toast.error("Failed to submit check-in. Please try again.");
    } finally {
      setCheckInLoading(false);
    }
  };
  
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
      
      {/* Daily Check-in Section */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Daily Check-in - {new Date().toLocaleDateString()}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {todaysCheckIn ? "Update your daily progress and activities." : "Submit your daily progress and activities."}
        </p>
        
        <form onSubmit={handleCheckInSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Hours Worked Today"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={checkInData.hoursWorked}
              onChange={(e) => handleCheckInChange('hoursWorked', e.target.value)}
              placeholder="8.0"
              required
            />
            
            <FormField label="Mood/Energy Level">
              <select
                value={checkInData.mood}
                onChange={(e) => handleCheckInChange('mood', e.target.value)}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="energetic">Energetic</option>
                <option value="productive">Productive</option>
                <option value="focused">Focused</option>
                <option value="satisfied">Satisfied</option>
                <option value="tired">Tired</option>
                <option value="stressed">Stressed</option>
              </select>
            </FormField>
          </div>
          
          <div>
            <FormField
              label={`Productivity Rating (${checkInData.productivity}/10)`}
              className="mb-2"
            />
            <input
              type="range"
              min="1"
              max="10"
              value={checkInData.productivity}
              onChange={(e) => handleCheckInChange('productivity', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Tasks Completed Today
            </label>
            <div className="space-y-2">
              {checkInData.tasksCompleted.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FormField
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value, 'tasksCompleted')}
                    placeholder="Describe what you accomplished..."
                    className="flex-1"
                  />
                  {checkInData.tasksCompleted.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(index, 'tasksCompleted')}
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
                onClick={() => addTask('tasksCompleted')}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Task
              </Button>
            </div>
          </div>
          
          <FormField
            label="Challenges or Issues"
            value={checkInData.challenges}
            onChange={(e) => handleCheckInChange('challenges', e.target.value)}
            placeholder="Any difficulties or blockers you encountered..."
            multiline
            rows={3}
          />
          
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Planned Tasks for Tomorrow
            </label>
            <div className="space-y-2">
              {checkInData.plannedTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FormField
                    value={task}
                    onChange={(e) => handleTaskChange(index, e.target.value, 'plannedTasks')}
                    placeholder="What do you plan to work on..."
                    className="flex-1"
                  />
                  {checkInData.plannedTasks.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(index, 'plannedTasks')}
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
                onClick={() => addTask('plannedTasks')}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Add Task
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={checkInLoading}
              size="lg"
            >
              {checkInLoading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ApperIcon name="CheckCircle" size={16} className="mr-2" />
                  {todaysCheckIn ? "Update Check-in" : "Submit Check-in"}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default VAProfileForm;