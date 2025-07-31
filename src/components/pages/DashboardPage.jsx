import React from "react";
import Dashboard from "@/components/organisms/Dashboard";

const DashboardPage = () => {
  // In a real app, this would come from auth context or URL params
  const userType = new URLSearchParams(window.location.search).get("type") || "client";
  
  return <Dashboard userType={userType} />;
};

export default DashboardPage;