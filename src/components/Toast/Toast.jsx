import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "✅";
    }
  };

  return (
    <div
      className={`toast toast--${type} ${isVisible ? "toast--visible" : ""}`}
    >
      <div className="toast__content">
        <span className="toast__icon">{getIcon()}</span>
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
