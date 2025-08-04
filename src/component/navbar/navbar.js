import React, { useMemo, useCallback, useState, useEffect } from "react";
import './navbar.css';
import { useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";
import { Menu, Divider, Tooltip } from "@aws-amplify/ui-react";
import logo from '../../assets/cloudxsuite_logo.png';

// Custom hook for user session management (unchanged)
const useUserSession = () => {
  const [userEmail, setUserEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const picture = sessionStorage.getItem('profilePicture');
    
    setUserEmail(email || '');
    setProfilePicture(picture === 'null' ? null : picture);

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

// User avatar component (unchanged functionality, updated styling)
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

// Main navbar component with landing page styling
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail, profilePicture, isOnline } = useUserSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Memoize whether to show navbar
  const shouldShowNavbar = useMemo(() => {
    return location.pathname !== "/";
  }, [location.pathname]);

  // Optimized signout handler (unchanged)
  const handleSignout = useCallback(async () => {
    try {
      const keysToRemove = ['email', 'token', 'profilePicture'];
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Signout error:', error);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Handle menu toggle (unchanged)
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Handle keyboard navigation (unchanged)
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
      className="modern-navbar" 
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="navbar-content">
        {/* Logo section with landing page styling */}
        <div className="logo-section">
          <div className="logo-wrapper">
            <img 
              src={logo} 
              alt="ConnectCloud Blogs Logo" 
              className="logo-image"
            />
            <div className="logo-glow" aria-hidden="true"></div>
          </div>
          
          <div className="brand-text">
            <span className="brand-name">ConnectCloud</span>
            <span className="brand-subtitle">Blogs</span>
          </div>
        </div>
        
        {/* Profile menu section with landing page styling */}
        <div className="navbar-actions">
          <Menu
            className="profile-menu-modern"
            isOpen={isMenuOpen}
            onOpenChange={setIsMenuOpen}
            trigger={
              <button
                className="profile-trigger-modern"
                onClick={handleMenuToggle}
                aria-label={`User menu for ${userEmail}`}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
              >
                <div className="profile-container-modern">
                  <UserAvatar 
                    profilePicture={profilePicture}
                    className="profile-avatar-modern"
                  />
                  <DownOutlined 
                    className={`profile-chevron-modern ${isMenuOpen ? 'chevron-open' : ''}`}
                    aria-hidden="true"
                  />
                </div>
              </button>
            }
          >
            <div className="menu-content-modern" role="menu">
              {/* User info header */}
              <div className="menu-header-modern" role="menuitem" tabIndex="-2">
                <div className="user-avatar-container-modern">
                  <UserAvatar 
                    profilePicture={profilePicture}
                    size="small"
                  />
                </div>
                
                <div className="user-info-modern">
                  <p className="menu-email-modern" title={userEmail}>
                    {userEmail || 'User'}
                  </p>
                  <span className={`user-status-modern ${isOnline ? 'status-online' : 'status-offline'}`}>
                    <span className="status-indicator-modern" aria-hidden="true"></span>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <Divider className="custom-divider-modern" />
              
              {/* Signout section */}
              <button
                onClick={handleSignout}
                onKeyDown={handleKeyDown}
                className="signout-section-modern"
                role="menuitem"
                aria-label="Sign out of your account"
              >
                <div className="signout-icon-modern">
                  <LogoutOutlined />
                </div>
                <span className="signout-text-modern">Sign Out</span>
                <div className="signout-arrow-modern" aria-hidden="true">→</div>
              </button>
            </div>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

// Export UserAvatar for reuse
export { UserAvatar };
