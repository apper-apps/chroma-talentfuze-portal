import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Progress from "@/components/atoms/Progress";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { roleService } from "@/services/api/roleService";
import { vaProfileService } from "@/services/api/vaProfileService";
import { matchService } from "@/services/api/matchService";
import { vaAssignmentService } from "@/services/api/vaAssignmentService";
import { vaTrainingService } from "@/services/api/vaTrainingService";
import { vaCheckInService } from "@/services/api/vaCheckInService";
const Dashboard = ({ userType = "client" }) => {
  const navigate = useNavigate();
const [data, setData] = useState({
    roles: [],
    profile: null,
    matches: [],
    assignments: [],
    training: [],
    checkIns: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    loadDashboardData();
  }, [userType]);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
if (userType === "client") {
        const [roles, matches, assignments] = await Promise.all([
          roleService.getAll(),
          matchService.getAll(),
          vaAssignmentService.getByClientId("client-1")
        ]);
        
        // Get VA profiles for assigned VAs
        const vaIds = assignments.map(a => a.vaId);
        const vaProfiles = await Promise.all(
          vaIds.map(id => vaProfileService.getById(id))
        );
        
        // Get training data for assigned VAs
        const trainingData = await Promise.all(
          vaIds.map(id => vaTrainingService.getByVAId(id))
        );
        const allTraining = trainingData.flat();
        
        // Get recent check-ins for assigned VAs
        const recentCheckIns = await vaCheckInService.getRecentByVAIds(vaIds, 7);
        
        // Enhance assignments with VA profile data
        const enhancedAssignments = assignments.map(assignment => {
          const vaProfile = vaProfiles.find(p => p.Id === assignment.vaId);
          const vaTraining = allTraining.filter(t => t.vaId === assignment.vaId);
          const vaCheckIns = recentCheckIns.filter(c => c.vaId === assignment.vaId);
          
          return {
            ...assignment,
            vaProfile,
            training: vaTraining,
            recentCheckIns: vaCheckIns
          };
        });
        
        const stats = {
          totalRoles: roles.length,
          activeRoles: roles.filter(r => r.status === "active").length,
          totalMatches: matches.length,
          pendingMatches: matches.filter(m => m.status === "pending").length,
          totalVAs: assignments.length,
          activeTraining: allTraining.filter(t => t.status === "in-progress").length
        };
        
        setData({ 
          roles: roles.slice(0, 5), 
          matches: matches.slice(0, 5), 
          assignments: enhancedAssignments,
          training: allTraining,
          checkIns: recentCheckIns,
          stats 
        });
      } else {
        const [profile, matches] = await Promise.all([
          vaProfileService.getById("va-1"),
          matchService.getMatchesForVA("va-1")
        ]);
        
        const stats = {
          profileCompletion: profile?.completionStatus || 0,
          totalMatches: matches.length,
          appliedRoles: matches.filter(m => m.status === "applied").length,
          pendingMatches: matches.filter(m => m.status === "pending").length
        };
        
        setData({ profile, matches: matches.slice(0, 5), stats });
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-white">
        <h1 className="text-3xl font-display font-bold mb-2">
          Welcome to TalentFuze
        </h1>
        <p className="text-white/90 text-lg">
          {userType === "client" 
            ? "Find the perfect virtual assistants for your business needs"
            : "Discover amazing opportunities that match your skills"
          }
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userType === "client" ? (
          <>
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Briefcase" className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.totalRoles}</div>
              <div className="text-gray-600">Total Roles</div>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="CheckCircle" className="text-success" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.activeRoles}</div>
              <div className="text-gray-600">Active Roles</div>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Users" className="text-accent" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.totalMatches}</div>
              <div className="text-gray-600">Total Matches</div>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Clock" className="text-warning" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.pendingMatches}</div>
              <div className="text-gray-600">Pending Reviews</div>
            </Card>
          </>
        ) : (
          <>
            <Card className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="User" className="text-primary" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.profileCompletion}%</div>
              <div className="text-gray-600">Profile Complete</div>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Target" className="text-accent" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.totalMatches}</div>
              <div className="text-gray-600">Opportunities</div>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Send" className="text-success" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.appliedRoles}</div>
              <div className="text-gray-600">Applications</div>
            </Card>
            <Card className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Clock" className="text-warning" size={24} />
              </div>
              <div className="text-2xl font-bold gradient-text">{data.stats.pendingMatches}</div>
              <div className="text-gray-600">Pending</div>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary">
              {userType === "client" ? "Recent Roles" : "Profile Status"}
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(userType === "client" ? "/roles" : "/profile")}
            >
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          {userType === "client" ? (
            <div className="space-y-4">
              {data.roles.length === 0 ? (
                <Empty
                  title="No roles yet"
                  description="Create your first role to start finding virtual assistants."
                  actionLabel="Create Role"
                  onAction={() => navigate("/roles/new")}
                  icon="Briefcase"
                />
              ) : (
                data.roles.map((role) => (
                  <div key={role.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary">{role.title}</h3>
                      <p className="text-sm text-gray-600">${role.salaryMin} - ${role.salaryMax}/month</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={role.status} />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/matches?role=${role.Id}`)}
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary">Profile Completion</span>
                <span className="text-sm font-bold gradient-text">{data.stats.profileCompletion}%</span>
              </div>
              <Progress value={data.stats.profileCompletion} color="accent" />
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-secondary mb-2">Complete your profile to get more matches</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <ApperIcon name={data.profile?.name ? "CheckCircle" : "Circle"} size={16} className="mr-2" />
                    Basic Information
                  </li>
                  <li className="flex items-center">
                    <ApperIcon name={data.profile?.discType ? "CheckCircle" : "Circle"} size={16} className="mr-2" />
                    DISC Assessment
                  </li>
                  <li className="flex items-center">
                    <ApperIcon name={Object.keys(data.profile?.skills || {}).length > 0 ? "CheckCircle" : "Circle"} size={16} className="mr-2" />
                    Skills Rating
                  </li>
                  <li className="flex items-center">
                    <ApperIcon name={data.profile?.portfolioUrls?.length > 0 ? "CheckCircle" : "Circle"} size={16} className="mr-2" />
                    Portfolio Links
                  </li>
                </ul>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => navigate("/profile")}
                >
                  Complete Profile
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        {/* Matches */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary">
              {userType === "client" ? "Top Matches" : "Recent Opportunities"}
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/matches")}
            >
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {data.matches.length === 0 ? (
              <Empty
                title="No matches yet"
                description={userType === "client" 
                  ? "Create roles to see matching virtual assistants."
                  : "Complete your profile to see matching opportunities."
                }
                actionLabel={userType === "client" ? "Create Role" : "Complete Profile"}
                onAction={() => navigate(userType === "client" ? "/roles/new" : "/profile")}
                icon="Users"
              />
            ) : (
              data.matches.map((match) => (
                <div key={match.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {match.matchScore}%
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary">
                        {userType === "client" ? "VA Match" : "Role Match"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {match.matchScore}% compatibility
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/matches?id=${match.Id}`)}
                  >
                    <ApperIcon name="Eye" size={16} />
                  </Button>
                </div>
              ))
            )}
</div>
        </Card>

        {/* Your Virtual Assistants */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-secondary">Your Virtual Assistants</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/matches')}>
              <ApperIcon name="Users" size={16} />
              View All VAs
            </Button>
          </div>
          
          {data.assignments.length === 0 ? (
            <Empty 
              icon="Users"
              title="No VAs Assigned"
              description="You don't have any virtual assistants assigned yet."
            />
          ) : (
            <div className="space-y-4">
              {data.assignments.map((assignment) => (
                <div key={assignment.Id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-secondary">{assignment.vaProfile?.name}</h3>
                        <p className="text-sm text-gray-600">{assignment.vaProfile?.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <StatusBadge status={assignment.status} />
                          <span className="text-xs text-gray-500">
                            {assignment.weeklyHours}h/week • ${assignment.hourlyRate}/hr
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Profile Completion</div>
                      <div className="flex items-center space-x-2">
                        <Progress value={assignment.vaProfile?.completionStatus || 0} className="w-16" />
                        <span className="text-sm font-medium">{assignment.vaProfile?.completionStatus || 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Training Progress */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-secondary mb-2">Training Progress</h4>
                    {assignment.training.length === 0 ? (
                      <p className="text-sm text-gray-500">No training courses assigned</p>
                    ) : (
                      <div className="space-y-2">
                        {assignment.training.slice(0, 2).map((training) => (
                          <div key={training.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{training.courseTitle}</p>
                              <p className="text-xs text-gray-600">{training.provider}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <StatusBadge status={training.status} />
                              {training.status === 'in-progress' && (
                                <div className="flex items-center space-x-1">
                                  <Progress value={training.progress || 0} className="w-12" />
                                  <span className="text-xs">{training.progress || 0}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {assignment.training.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{assignment.training.length - 2} more courses
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Recent Check-ins */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-secondary mb-2">Recent Check-ins</h4>
                    {assignment.recentCheckIns.length === 0 ? (
                      <p className="text-sm text-gray-500">No recent check-ins</p>
                    ) : (
                      <div className="space-y-2">
                        {assignment.recentCheckIns.slice(0, 2).map((checkIn) => (
                          <div key={checkIn.Id} className="p-2 bg-gray-50 rounded">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">
                                {new Date(checkIn.date).toLocaleDateString()}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {checkIn.hoursWorked}h worked
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {checkIn.mood}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm">
                              {checkIn.tasksCompleted.length} tasks completed
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Assigned Tasks */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-secondary mb-2">Assigned Tasks</h4>
                    <div className="flex flex-wrap gap-1">
                      {assignment.assignedTasks.map((task, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {task}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/profile/${assignment.vaId}`)}
                    >
                      <ApperIcon name="User" size={14} />
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/training/${assignment.vaId}`)}
                    >
                      <ApperIcon name="BookOpen" size={14} />
                      Training
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/checkins/${assignment.vaId}`)}
                    >
                      <ApperIcon name="Calendar" size={14} />
                      Check-ins
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userType === "client" ? (
            <>
              <Button
                variant="primary"
                className="h-20 flex-col"
                onClick={() => navigate("/roles/new")}
              >
                <ApperIcon name="Plus" size={24} className="mb-2" />
                Create New Role
              </Button>
              <Button
                variant="secondary"
                className="h-20 flex-col"
                onClick={() => navigate("/matches")}
              >
                <ApperIcon name="Users" size={24} className="mb-2" />
                View All Matches
              </Button>
              <Button
                variant="ghost"
                className="h-20 flex-col"
                onClick={() => navigate("/profile")}
              >
                <ApperIcon name="Settings" size={24} className="mb-2" />
                Account Settings
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                className="h-20 flex-col"
                onClick={() => navigate("/profile")}
              >
                <ApperIcon name="User" size={24} className="mb-2" />
                Complete Profile
              </Button>
              <Button
                variant="secondary"
                className="h-20 flex-col"
                onClick={() => navigate("/opportunities")}
              >
                <ApperIcon name="Target" size={24} className="mb-2" />
                Browse Opportunities
              </Button>
              <Button
                variant="ghost"
                className="h-20 flex-col"
                onClick={() => navigate("/matches")}
              >
                <ApperIcon name="Users" size={24} className="mb-2" />
                View Matches
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;