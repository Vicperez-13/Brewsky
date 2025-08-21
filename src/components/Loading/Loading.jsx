import React from "react";
import "./Loading.css";

const Loading = ({
  message = "Loading...",
  size = "medium",
  overlay = false,
}) => {
  const sizeClasses = {
    small: "loading--small",
    medium: "loading--medium",
    large: "loading--large",
  };

  const LoadingSpinner = () => (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <div className="coffee-cup">
        <div className="coffee-steam">
          <div className="steam steam-1">☁</div>
          <div className="steam steam-2">☁</div>
          <div className="steam steam-3">☁</div>
        </div>
        ☕
      </div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner />
      </div>
    );
  }

  return <LoadingSpinner />;
};

export default Loading;
