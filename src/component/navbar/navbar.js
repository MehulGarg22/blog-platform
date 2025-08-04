import React, { useMemo, useCallback, useState, useEffect } from "react";
import './navbar.css';
import { useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { Menu, Divider } from "@aws-amplify/ui-react";
import logo from '../../assets/cloudxsuite_logo.png';

// Custom hook for user session management
const useUserSession = () => {
  const [userEmail, setUserEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Initialize user data
    const email = sessionStorage.getItem('email');
    const picture = sessionStorage.getItem('profilePicture');
    
    setUserEmail(email || '');
    setProfilePicture(picture === 'null' ? null : picture);

    // Monitor online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { userEmail, profilePicture, isOnline };
};

// User avatar component for reusability
const UserAvatar = ({ profilePicture, className = "", size = "default" }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const sizeClasses = {
    small: "avatar-small",
    default: "avatar-default", 
    large: "avatar-large"
  };

  if (!profilePicture || imageError) {
    return (
      <div className={`default-user-icon-wrapper ${sizeClasses[size]} ${className}`}>
        <UserOutlined className="default-user-icon" />
      </div>
    );
  }

  return (
    <img
      src={profilePicture}
      alt="User profile"
      className={`profile-image ${sizeClasses[size]} ${className}`}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

// Main navbar component
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail, profilePicture, isOnline } = useUserSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Memoize whether to show navbar
  const shouldShowNavbar = useMemo(() => {
    return location.pathname !== "/";
  }, [location.pathname]);

  // Optimized signout handler
  const handleSignout = useCallback(async () => {
    try {
      // Clear session data
      const keysToRemove = ['email', 'token', 'profilePicture'];
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      // Optional: Call logout API here
      // await logoutAPI();
      
      // Navigate to login
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Signout error:', error);
      // Still navigate even if cleanup fails
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Handle menu toggle
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSignout();
    }
  }, [handleSignout]);

  // Don't render on login page
  if (!shouldShowNavbar) return null;

  return (
    <nav 
      className="login-navbar" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="navbar-gradient-overlay" aria-hidden="true"></div>
      
      <div className="navbar-wrapper">
        {/* Logo and title section */}
        <div className="logo-title-section">
          <div className="logo-container">
            <img 
              src={logo} 
              alt="ConnectCloud Blogs Logo" 
              className="logo-img"
              width="40"
              height="40"
            />
            <div className="logo-glow" aria-hidden="true"></div>
          </div>
          
          <div className="title-container">
            <span className="title-text">ConnectCloud</span>
            <span className="title-subtext">Blogs</span>
          </div>
        </div>
        
        {/* Profile menu section */}
        <div className="profile-section">
          <Menu
            className="profile-menu"
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            trigger={
              <button
                className="profile-trigger"
                onClick={handleMenuToggle}
                aria-label={`User menu for ${userEmail}`}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                <div className="profile-container">
                  <UserAvatar 
                    profilePicture={profilePicture}
                    className="profile-avatar"
                  />
                  <div className="profile-ring" aria-hidden="true"></div>
                  <DownOutlined 
                    className={`profile-chevron ${isMenuOpen ? 'chevron-open' : ''}`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            }
          >
            <div className="menu-content" role="menu">
              {/* User info header */}
              <div className="menu-header" role="menuitem" tabIndex="-1">
                <div className="user-avatar-container">
                  <UserAvatar 
                    profilePicture={profilePicture}
                    size="small"
                  />
                </div>
                
                <div className="user-info">
                  <p className="menu-email" title={userEmail}>
                    {userEmail || 'User'}
                  </p>
                  <span className={`user-status ${isOnline ? 'status-online' : 'status-offline'}`}>
                    <span className="status-indicator" aria-hidden="true"></span>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <Divider className="custom-divider" />
              
              {/* Signout section */}
              <button
                onClick={handleSignout}
                onKeyDown={handleKeyDown}
                className="signout-section"
                role="menuitem"
                aria-label="Sign out of your account"
              >
                <div className="signout-icon">
                  <LogoutOutlined />
                </div>
                <span className="signout-text">Sign Out</span>
                <div className="signout-arrow" aria-hidden="true">→</div>
              </button>
            </div>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

// Optional: Export UserAvatar for reuse in other components
export { UserAvatar };
