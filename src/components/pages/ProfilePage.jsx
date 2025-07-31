import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VAProfileForm from "@/components/organisms/VAProfileForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { vaProfileService } from "@/services/api/vaProfileService";
import { vaAssignmentService } from "@/services/api/vaAssignmentService";
import { vaTrainingService } from "@/services/api/vaTrainingService";
import { vaCheckInService } from "@/services/api/vaCheckInService";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignedVAs, setAssignedVAs] = useState([]);
  const [vaDetails, setVADetails] = useState({});
  const [vaTrainings, setVATrainings] = useState({});
  const [vaCheckIns, setVACheckIns] = useState({});
  // In a real app, this would come from auth context
  const userType = searchParams.get("type") || "va";
  
useEffect(() => {
    if (userType === "va") {
      loadProfile();
    } else if (userType === "client") {
      loadClientData();
    } else {
      setLoading(false);
    }
  }, [userType]);
  
  const loadClientData = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load assigned VAs for client-1 (in real app, get from auth)
      const assignments = await vaAssignmentService.getByClientId("client-1");
      setAssignedVAs(assignments);
      
      // Load VA profiles
      const vaDetailsMap = {};
      const vaTrainingsMap = {};
      const vaCheckInsMap = {};
      
      for (const assignment of assignments) {
        const vaProfile = await vaProfileService.getById(assignment.vaId);
        const trainings = await vaTrainingService.getByVAId(assignment.vaId);
        const checkIns = await vaCheckInService.getByVAId(assignment.vaId, 7);
        
        vaDetailsMap[assignment.vaId] = vaProfile;
        vaTrainingsMap[assignment.vaId] = trainings;
        vaCheckInsMap[assignment.vaId] = checkIns;
      }
      
      setVADetails(vaDetailsMap);
      setVATrainings(vaTrainingsMap);
      setVACheckIns(vaCheckInsMap);
    } catch (err) {
      setError("Failed to load your VA team data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const profileData = await vaProfileService.getById("va-1");
      setProfile(profileData);
    } catch (err) {
      // Profile might not exist yet, that's okay
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileSave = (savedProfile) => {
    setProfile(savedProfile);
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;
  
if (userType === "client") {
    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadClientData} />;
    
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-secondary">
            Your VA Team
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your assigned Virtual Assistants, view their progress, and see daily check-ins.
          </p>
        </div>
        
        {assignedVAs.length === 0 ? (
          <Card className="text-center py-12">
            <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-secondary mb-2">
              No VAs Assigned Yet
            </h3>
            <p className="text-gray-600">
              Once you have VAs assigned to your roles, they'll appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {assignedVAs.map((assignment) => {
              const va = vaDetails[assignment.vaId];
              const trainings = vaTrainings[assignment.vaId] || [];
              const checkIns = vaCheckIns[assignment.vaId] || [];
              const recentCheckIn = checkIns[0];
              
              if (!va) return null;
              
              return (
                <Card key={assignment.Id} className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {va.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-secondary">
                          {va.name}
                        </h3>
                        <p className="text-gray-600">{va.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="success" size="sm">
                            {assignment.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            ${assignment.hourlyRate}/hour • {assignment.weeklyHours}h/week
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">Profile Completion</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={va.completionStatus} size="sm" className="w-20" />
                        <span className="text-sm font-medium">{va.completionStatus}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Assigned Tasks */}
                    <div>
                      <h4 className="font-medium text-secondary mb-3">Assigned Tasks</h4>
                      <div className="space-y-2">
                        {assignment.assignedTasks.map((task, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <ApperIcon name="CheckCircle2" size={16} className="text-success" />
                            <span className="text-sm">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Training Progress */}
                    <div>
                      <h4 className="font-medium text-secondary mb-3">Training Progress</h4>
                      <div className="space-y-2">
                        {trainings.slice(0, 3).map((training) => (
                          <div key={training.Id} className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{training.courseTitle}</span>
                              <Badge 
                                variant={training.status === 'completed' ? 'success' : 
                                       training.status === 'in-progress' ? 'warning' : 'secondary'}
                                size="xs"
                              >
                                {training.status}
                              </Badge>
                            </div>
                            {training.status === 'in-progress' && (
                              <Progress value={training.progress} size="xs" className="mt-1" />
                            )}
                          </div>
                        ))}
                        {trainings.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{trainings.length - 3} more courses
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Recent Check-in */}
                    <div>
                      <h4 className="font-medium text-secondary mb-3">Latest Check-in</h4>
                      {recentCheckIn ? (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">
                                {new Date(recentCheckIn.date).toLocaleDateString()}
                              </span>
                              <span className="font-medium">
                                {recentCheckIn.hoursWorked}h worked
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <ApperIcon name="TrendingUp" size={14} className="text-accent" />
                              <span className="text-xs text-gray-600">
                                Productivity: {recentCheckIn.productivity}/10
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600">
                            Tasks: {recentCheckIn.tasksCompleted.length} completed
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          No check-ins yet
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Started {new Date(assignment.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          // In real app, open detailed view
                          toast.info("VA details view coming soon!");
                        }}
                      >
                        <ApperIcon name="Eye" size={16} className="mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          // In real app, open check-ins history
                          toast.info("Check-ins history coming soon!");
                        }}
                      >
                        <ApperIcon name="Calendar" size={16} className="mr-2" />
                        Check-ins
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  
  return <VAProfileForm profile={profile} onSave={handleProfileSave} />;
};

export default ProfilePage;