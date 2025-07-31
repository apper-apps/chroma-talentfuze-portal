import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RoleForm from "@/components/organisms/RoleForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { roleService } from "@/services/api/roleService";

const EditRolePage = () => {
  const { id } = useParams();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    loadRole();
  }, [id]);
  
  const loadRole = async () => {
    try {
      setLoading(true);
      setError("");
      const roleData = await roleService.getById(parseInt(id));
      setRole(roleData);
    } catch (err) {
      setError("Failed to load role. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRole} />;
  if (!role) return <Error message="Role not found." />;
  
  return <RoleForm role={role} isEditing={true} />;
};

export default EditRolePage;