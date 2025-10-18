import React, { useState } from "react";
import "../style/password.css";
export default function PasswordInput({
  name = "password",
  value,
  onChange,
  placeholder = "Password",
  id,
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  const toggle = () => setVisible((v) => !v);

  return (
    <div
      className={`password-input-wrapper ${className}`}
      style={{ position: "relative" }}
    >
      <input
        id={id || name}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        style={{ paddingRight: 42 }} // space for the icon
      />

      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={toggle}
        className="password-toggle"
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-20%)",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 4,
        }}
      >
        {/* Simple icon (you can replace with svg or img) */}
        {visible ? "👁" : "👁️"}
      </button>
    </div>
  );
}
