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
    <div className="auth-modal__overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal__header">
          <h2>{mode === "login" ? "Welcome Back" : "Join Brewsky"}</h2>
          <button className="auth-modal__close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-modal__form">
          {errors.general && (
            <div className="auth-modal__error auth-modal__error--general">
              {errors.general}
            </div>
          )}

          {mode === "signup" && (
            <>
              <div className="auth-modal__form-row">
                <div className="auth-modal__form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={
                      errors.firstName ? "auth-modal__input--error" : ""
                    }
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <span className="auth-modal__error-message">
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div className="auth-modal__form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={
                      errors.lastName ? "auth-modal__input--error" : ""
                    }
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <span className="auth-modal__error-message">
                      {errors.lastName}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="auth-modal__form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "auth-modal__input--error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="auth-modal__error-message">{errors.email}</span>
            )}
          </div>

          <div className="auth-modal__form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "auth-modal__input--error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="auth-modal__error-message">
                {errors.password}
              </span>
            )}
          </div>

          {mode === "signup" && (
            <div className="auth-modal__form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={
                  errors.confirmPassword ? "auth-modal__input--error" : ""
                }
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <span className="auth-modal__error-message">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="auth-modal__submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-modal__loading">
                <span className="auth-modal__spinner"></span>
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </span>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <div className="auth-modal__switch">
            {mode === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleSwitchMode}
                  className="auth-modal__switch-btn"
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
                  className="auth-modal__switch-btn"
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
