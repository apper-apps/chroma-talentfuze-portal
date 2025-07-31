import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import DashboardPage from "@/components/pages/DashboardPage";
import RolesPage from "@/components/pages/RolesPage";
import NewRolePage from "@/components/pages/NewRolePage";
import EditRolePage from "@/components/pages/EditRolePage";
import MatchesPage from "@/components/pages/MatchesPage";
import ProfilePage from "@/components/pages/ProfilePage";
import OpportunitiesPage from "@/components/pages/OpportunitiesPage";

function App() {
  // In a real app, this would come from auth context
  const userType = new URLSearchParams(window.location.search).get("type") || "client";
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header userType={userType} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/roles/new" element={<NewRolePage />} />
            <Route path="/roles/:id/edit" element={<EditRolePage />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;