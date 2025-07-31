import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { roleService } from "@/services/api/roleService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const OpportunitiesPage = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  
  useEffect(() => {
    loadOpportunities();
  }, []);
  
  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError("");
      
      const rolesData = await roleService.getAll();
      // Filter to show only active roles for VAs
      const activeRoles = rolesData.filter(role => role.status === "active");
      setOpportunities(activeRoles);
      
    } catch (err) {
      setError("Failed to load opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleApply = async (roleId) => {
    try {
      // In a real app, this would submit an application
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application.");
    }
  };
  
  const handleSave = async (roleId) => {
    try {
      // In a real app, this would save to favorites/bookmarks
      toast.success("Opportunity saved to your favorites!");
    } catch (error) {
      toast.error("Failed to save opportunity.");
    }
  };
  
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.requiredSkills.some(skill => 
                           skill.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesExperience = experienceFilter === "all" || opportunity.experienceLevel === experienceFilter;
    
    const matchesSalary = salaryFilter === "all" || 
                         (salaryFilter === "500-1000" && opportunity.salaryMax <= 1000) ||
                         (salaryFilter === "1000-1500" && opportunity.salaryMin >= 1000 && opportunity.salaryMax <= 1500) ||
                         (salaryFilter === "1500+" && opportunity.salaryMin >= 1500);
    
    return matchesSearch && matchesExperience && matchesSalary;
  });
  
  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadOpportunities} />;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-secondary">Opportunities</h1>
          <p className="text-gray-600">Discover virtual assistant roles that match your skills</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate("/profile")}
        >
          <ApperIcon name="User" size={16} className="mr-2" />
          Complete Profile
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities..."
          className="flex-1"
        />
        <select
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="all">All Experience Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </select>
        <select
          value={salaryFilter}
          onChange={(e) => setSalaryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="all">All Salary Ranges</option>
          <option value="500-1000">$500 - $1,000</option>
          <option value="1000-1500">$1,000 - $1,500</option>
          <option value="1500+">$1,500+</option>
        </select>
      </div>
      
      {filteredOpportunities.length === 0 ? (
        <Empty
          title="No opportunities found"
          description={searchQuery || experienceFilter !== "all" || salaryFilter !== "all"
            ? "Try adjusting your search or filter criteria."
            : "New opportunities are posted regularly. Check back soon!"
          }
          actionLabel="Complete Profile"
          onAction={() => navigate("/profile")}
          icon="Target"
        />
      ) : (
        <div className="grid gap-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.Id} hover className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary mb-1">
                        {opportunity.title}
                      </h3>
                      <p className="text-gray-600">
                        ${opportunity.salaryMin} - ${opportunity.salaryMax}/month • {opportunity.experienceLevel} level
                      </p>
                    </div>
                    <StatusBadge status={opportunity.status} />
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="text-sm font-medium text-secondary mb-2">Required Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.requiredSkills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="primary">
                          {skill}
                        </Badge>
                      ))}
                      {opportunity.requiredSkills.length > 6 && (
                        <Badge variant="default">
                          +{opportunity.requiredSkills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Calendar" size={16} className="mr-2" />
                    Posted {format(new Date(opportunity.createdAt), "MMM d, yyyy")}
                    <span className="mx-3">•</span>
                    <ApperIcon name="MapPin" size={16} className="mr-2" />
                    Remote
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:min-w-[160px]">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApply(opportunity.Id)}
                  >
                    <ApperIcon name="Send" size={16} className="mr-2" />
                    Apply Now
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/matches?role=${opportunity.Id}&type=va`)}
                  >
                    <ApperIcon name="Eye" size={16} className="mr-2" />
                    View Match
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(opportunity.Id)}
                  >
                    <ApperIcon name="Bookmark" size={16} className="mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunitiesPage;