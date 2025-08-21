import React, { useState } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "./Toast";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = {
    showToast,
    success: (message, duration) => showToast(message, "success", duration),
    error: (message, duration) => showToast(message, "error", duration),
    warning: (message, duration) => showToast(message, "warning", duration),
    info: (message, duration) => showToast(message, "info", duration),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <div key={toast.id} style={{ top: `${20 + index * 70}px` }}>
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              onClose={() => removeToast(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
