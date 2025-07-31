import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import VAProfileForm from "@/components/organisms/VAProfileForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { vaProfileService } from "@/services/api/vaProfileService";

const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // In a real app, this would come from auth context
  const userType = searchParams.get("type") || "va";
  
  useEffect(() => {
    if (userType === "va") {
      loadProfile();
    } else {
      // For client users, show a simple settings page instead
      setLoading(false);
    }
  }, [userType]);
  
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
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-display font-bold text-secondary mb-4">
            Client Settings
          </h1>
          <p className="text-gray-600">
            Client profile management features will be available soon.
          </p>
        </div>
      </div>
    );
  }
  
  return <VAProfileForm profile={profile} onSave={handleProfileSave} />;
};

export default ProfilePage;