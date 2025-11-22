import React from "react";

export default function Popup({ open = false, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        {title && <div className="popup-header">
          <div className="popup-title">{title}</div>
          <button className="popup-close" onClick={onClose}><span>Close</span></button>
        </div>}
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );
}