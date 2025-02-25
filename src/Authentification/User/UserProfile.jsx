// UserProfile.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import './UserProfile.css';

const UserProfile = () => {
  const { authState, logout } = useContext(AuthContext);
  const [error, setError] = useState("");

  if (error) {
    return <span className="text-warning">{error}</span>;
  }

  if (!authState.user) {
    return <div className="loading-profile">Chargement...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-profile-wrapper">
      <DropdownButton
        id="dropdown-user-menu"
        title={
          <div className="profile-trigger">
            <PersonCircle size={28} />
          </div>
        }
        variant="link"
        drop="down"
        align="end"
        className="custom-dropdown"
      >
        <div className="dropdown-menu-content">
          <div className="user-info-header">
            <PersonCircle size={32} className="user-icon" />
            <div className="user-details">
              <span className="user-name">{authState.user.prénom} {authState.user.nom}</span>
              <span className="user-email">{authState.user.email}</span>
            </div>
          </div>
          
          <Dropdown.Divider className="menu-divider" />

          <Dropdown.Item 
            onClick={handleLogout}
            className="menu-item logout-item"
          >
            <BoxArrowRight className="me-2" size={18} />
            Se déconnecter
          </Dropdown.Item>
        </div>
      </DropdownButton>
    </div>
  );
};

export default UserProfile;