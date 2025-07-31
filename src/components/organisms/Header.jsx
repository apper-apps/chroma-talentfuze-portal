import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ userType = "client" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = userType === "client" 
    ? [
        { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
        { name: "Roles", href: "/roles", icon: "Briefcase" },
        { name: "Matches", href: "/matches", icon: "Users" },
        { name: "Profile", href: "/profile", icon: "User" }
      ]
    : [
        { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
        { name: "Opportunities", href: "/opportunities", icon: "Target" },
        { name: "Matches", href: "/matches", icon: "Users" },
        { name: "Profile", href: "/profile", icon: "User" }
      ];
  
  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <header className="bg-surface border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="text-white" size={20} />
            </div>
            <span className="text-xl font-display font-bold text-secondary">
              TalentFuze
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/10",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-gray-600 hover:text-primary"
                )}
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(userType === "client" ? "/roles/new" : "/profile")}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {userType === "client" ? "New Role" : "Complete Profile"}
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-primary hover:bg-primary/10"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate(userType === "client" ? "/roles/new" : "/profile");
                  }}
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  {userType === "client" ? "New Role" : "Complete Profile"}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;