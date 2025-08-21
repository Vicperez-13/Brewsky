import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthModal/useAuth";
import "./UserProfile.css";

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          {!isEditing ? (
            <div className="profile-info">
              <h3>
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="profile-email">{user?.email}</p>
              {user?.bio && <p className="profile-bio">{user.bio}</p>}
              {user?.location && (
                <p className="profile-location">📍 {user.location}</p>
              )}

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">
                    {user?.favorites?.length || 0}
                  </span>
                  <span className="stat-label">Favorites</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {user?.posts?.length || 0}
                  </span>
                  <span className="stat-label">Posts</span>
                </div>
              </div>

              <div className="profile-actions">
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-edit-form">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={editForm.location}
                  onChange={handleInputChange}
                  placeholder="City, State"
                />
              </div>

              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
