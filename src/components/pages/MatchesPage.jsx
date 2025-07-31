import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import MatchResults from "@/components/organisms/MatchResults";
import ApperIcon from "@/components/ApperIcon";
import { roleService } from "@/services/api/roleService";

const MatchesPage = () => {
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get("role");
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(roleId ? parseInt(roleId) : null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // In a real app, this would come from auth context
  const userType = searchParams.get("type") || "client";
  
  useEffect(() => {
    loadRoles();
  }, []);
  
  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");
      const rolesData = await roleService.getAll();
      setRoles(rolesData);
      
      if (!selectedRoleId && rolesData.length > 0) {
        setSelectedRoleId(rolesData[0].Id);
      }
    } catch (err) {
      setError("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRoles} />;
  
  if (roles.length === 0) {
    return (
      <Empty
        title="No roles available"
        description="Create your first role to start seeing matches."
        actionLabel="Create Role"
        icon="Briefcase"
      />
    );
  }
  
  const selectedRole = roles.find(role => role.Id === selectedRoleId);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Role Selection Sidebar */}
        <div className="lg:w-80">
          <Card className="p-4">
            <h2 className="font-semibold text-secondary mb-4">
              {userType === "client" ? "Your Roles" : "Available Roles"}
            </h2>
            <div className="space-y-2">
              {roles.map((role) => (
                <button
                  key={role.Id}
                  onClick={() => setSelectedRoleId(role.Id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    selectedRoleId === role.Id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
                    {role.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${role.salaryMin} - ${role.salaryMax}/month
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Match Results */}
        <div className="flex-1">
          {selectedRole && (
            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-semibold text-secondary">
                      {selectedRole.title}
                    </h1>
                    <p className="text-gray-600">
                      ${selectedRole.salaryMin} - ${selectedRole.salaryMax}/month • {selectedRole.experienceLevel} level
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      // In a real app, this would open role details modal
                    }}
                  >
                    <ApperIcon name="Eye" size={16} className="mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
              
              <MatchResults roleId={selectedRoleId} userType={userType} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;