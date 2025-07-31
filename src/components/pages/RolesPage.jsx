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
import { matchService } from "@/services/api/matchService";
import { format } from "date-fns";

const RolesPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    loadRoles();
  }, []);
  
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");
      
      const rolesData = await roleService.getAll();
      setRoles(rolesData);
      
      // Load match counts for each role
      const matchCounts = {};
      for (const role of rolesData) {
        try {
          const roleMatches = await matchService.getMatchesForRole(role.Id);
          matchCounts[role.Id] = roleMatches.length;
        } catch (err) {
          matchCounts[role.Id] = 0;
        }
      }
      setMatches(matchCounts);
      
    } catch (err) {
      setError("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) {
      return;
    }
    
    try {
      await roleService.delete(roleId);
      setRoles(prev => prev.filter(role => role.Id !== roleId));
    } catch (error) {
      alert("Failed to delete role. Please try again.");
    }
  };
  
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.requiredSkills.some(skill => 
                           skill.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesStatus = statusFilter === "all" || role.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadRoles} />;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-secondary">Role Requests</h1>
          <p className="text-gray-600">Manage your virtual assistant role requirements</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/roles/new")}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create New Role
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search roles..."
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      
      {filteredRoles.length === 0 ? (
        <Empty
          title="No roles found"
          description={searchQuery || statusFilter !== "all" 
            ? "Try adjusting your search or filter criteria."
            : "Create your first role to start finding virtual assistants."
          }
          actionLabel="Create Role"
          onAction={() => navigate("/roles/new")}
          icon="Briefcase"
        />
      ) : (
        <div className="grid gap-6">
          {filteredRoles.map((role) => (
            <Card key={role.Id} hover className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary mb-1">
                        {role.title}
                      </h3>
                      <p className="text-gray-600">
                        ${role.salaryMin} - ${role.salaryMax}/month • {role.experienceLevel} level
                      </p>
                    </div>
                    <StatusBadge status={role.status} />
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {role.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {role.requiredSkills.slice(0, 5).map((skill, index) => (
                      <Badge key={index} variant="primary">
                        {skill}
                      </Badge>
                    ))}
                    {role.requiredSkills.length > 5 && (
                      <Badge variant="default">
                        +{role.requiredSkills.length - 5} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <ApperIcon name="Calendar" size={16} className="mr-2" />
                    Created {format(new Date(role.createdAt), "MMM d, yyyy")}
                    <span className="mx-3">•</span>
                    <ApperIcon name="Users" size={16} className="mr-2" />
                    {matches[role.Id] || 0} matches
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 lg:min-w-[160px]">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/matches?role=${role.Id}`)}
                  >
                    <ApperIcon name="Users" size={16} className="mr-2" />
                    View Matches ({matches[role.Id] || 0})
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/roles/${role.Id}/edit`)}
                  >
                    <ApperIcon name="Edit" size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRole(role.Id)}
                    className="text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} className="mr-2" />
                    Delete
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

export default RolesPage;