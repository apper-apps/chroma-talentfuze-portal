import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import MatchScore from "@/components/molecules/MatchScore";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { matchService } from "@/services/api/matchService";
import { vaProfileService } from "@/services/api/vaProfileService";
import { toast } from "react-toastify";

const MatchResults = ({ roleId, userType = "client" }) => {
  const [matches, setMatches] = useState([]);
  const [vaProfiles, setVaProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("score");
  
  useEffect(() => {
    loadMatches();
  }, [roleId]);
  
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load matches for the role
      const matchData = await matchService.getMatchesForRole(roleId);
      setMatches(matchData);
      
      // Load VA profiles for all matches
      const profilePromises = matchData.map(match => 
        vaProfileService.getById(match.vaId)
      );
      const profiles = await Promise.all(profilePromises);
      
      const profilesMap = {};
      profiles.forEach(profile => {
        if (profile) {
          profilesMap[profile.Id] = profile;
        }
      });
      setVaProfiles(profilesMap);
      
    } catch (err) {
      setError("Failed to load matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleContact = async (vaId) => {
    try {
      // In a real app, this would open a contact modal or messaging system
      toast.success("Contact request sent to VA!");
    } catch (error) {
      toast.error("Failed to send contact request.");
    }
  };
  
  const handleApply = async (matchId) => {
    try {
      // In a real app, this would submit an application
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application.");
    }
  };
  
  const filteredAndSortedMatches = matches
    .filter(match => {
      const profile = vaProfiles[match.vaId];
      if (!profile) return false;
      
      const searchLower = searchQuery.toLowerCase();
      return (
        profile.name.toLowerCase().includes(searchLower) ||
        Object.keys(profile.skills || {}).some(skill => 
          skill.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      if (sortBy === "score") {
        return b.matchScore - a.matchScore;
      } else if (sortBy === "name") {
        const nameA = vaProfiles[a.vaId]?.name || "";
        const nameB = vaProfiles[b.vaId]?.name || "";
        return nameA.localeCompare(nameB);
      }
      return 0;
    });
  
  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadMatches} />;
  if (matches.length === 0) {
    return (
      <Empty
        title="No matches found"
        description="Our AI is still analyzing candidates. Check back soon for perfect matches!"
        icon="Users"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-secondary">
            {userType === "client" ? "Matched Virtual Assistants" : "Matched Opportunities"}
          </h2>
          <p className="text-gray-600">
            Found {filteredAndSortedMatches.length} perfect matches
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or skill..."
            className="w-full sm:w-64"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="score">Sort by Match Score</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredAndSortedMatches.map((match) => {
          const profile = vaProfiles[match.vaId];
          if (!profile) return null;
          
          return (
            <Card key={match.Id} hover className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {profile.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary">{profile.name}</h3>
                    <p className="text-gray-600 capitalize">{profile.experience} Level</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="primary">{profile.discType} Type</Badge>
                      <Badge variant="default">${profile.salaryExpectation}/month</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <MatchScore score={match.matchScore} size="lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary mb-2">Top Skills Match</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.skills || {})
                        .filter(([skill, rating]) => rating >= 4)
                        .slice(0, 4)
                        .map(([skill, rating]) => (
                          <Badge key={skill} variant="accent" className="text-xs">
                            {skill} ({rating}/5)
                          </Badge>
                        ))}
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-secondary mb-1">Match Factors</h5>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(match.matchFactors || {}).map(([factor, score]) => (
                          <div key={factor} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {factor}: {score}%
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 min-w-[140px]">
                  {userType === "client" ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleContact(profile.Id)}
                      >
                        <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                        Contact
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(profile.portfolioUrls?.[0], "_blank")}
                        disabled={!profile.portfolioUrls?.length}
                      >
                        <ApperIcon name="ExternalLink" size={16} className="mr-2" />
                        Portfolio
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApply(match.Id)}
                      >
                        <ApperIcon name="Send" size={16} className="mr-2" />
                        Apply
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                      >
                        <ApperIcon name="Eye" size={16} className="mr-2" />
                        View Role
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MatchResults;