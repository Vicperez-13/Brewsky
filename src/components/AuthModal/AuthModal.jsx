import React, { useState, createContext, useContext, useEffect } from "react";
import "./AuthModal.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("brewsky_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("brewsky_user");
      }
    }
  }, []);

  const login = (userData) => {
    const userWithDefaults = {
      ...userData,
      favorites: userData.favorites || [],
      posts: userData.posts || [],
      bio: userData.bio || "",
      location: userData.location || "",
      createdAt: userData.createdAt || new Date().toISOString(),
    };
    setIsAuthenticated(true);
    setUser(userWithDefaults);
    localStorage.setItem("brewsky_user", JSON.stringify(userWithDefaults));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("brewsky_user");
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("brewsky_user", JSON.stringify(updatedUser));
  };

  const addToFavorites = (coffeeShop) => {
    if (!user) return;
    const updatedFavorites = [...(user.favorites || [])];
    const existingIndex = updatedFavorites.findIndex(
      (fav) => fav.id === coffeeShop.id
    );

    if (existingIndex === -1) {
      updatedFavorites.push(coffeeShop);
    }

    updateUser({ favorites: updatedFavorites });
  };

  const removeFromFavorites = (coffeeShopId) => {
    if (!user) return;
    const updatedFavorites = (user.favorites || []).filter(
      (fav) => fav.id !== coffeeShopId
    );
    updateUser({ favorites: updatedFavorites });
  };

  const isFavorite = (coffeeShopId) => {
    if (!user?.favorites) return false;
    return user.favorites.some((fav) => fav.id === coffeeShopId);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      isAuthenticated: false,
      user: null,
      login: () => {},
      logout: () => {},
      updateUser: () => {},
      addToFavorites: () => {},
      removeFromFavorites: () => {},
      isFavorite: () => false,
    };
  }
  return context;
};

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "signup") {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName || formData.email.split("@")[0],
        lastName: formData.lastName || "",
        createdAt: new Date().toISOString(),
      };

      login(userData);
      alert(`${mode === "login" ? "Login" : "Signup"} successful!`);
      onClose();

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
    } catch (error) {
      setErrors({ general: "Authentication failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setErrors({});
    onSwitchMode();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{mode === "login" ? "Welcome Back" : "Join Brewsky"}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          {mode === "signup" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "error" : ""}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "error" : ""}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName}</span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? "error" : ""}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </span>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <div className="auth-switch">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleSwitchMode}
                  className="switch-button"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleSwitchMode}
                  className="switch-button"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
