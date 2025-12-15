import React from 'react';

const Logo = ({ size = 'medium', showText = true, className = '' }) => {
  const sizes = {
    small: { icon: '1.5rem', text: '1rem' },
    medium: { icon: '2rem', text: '1.25rem' },
    large: { icon: '3rem', text: '1.75rem' }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div className={`d-flex align-items-center ${className}`} style={{ gap: '0.75rem' }}>
      <div style={{ 
        width: currentSize.icon, 
        height: currentSize.icon,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="#0d6efd" />
          
          {/* Vehicle body */}
          <rect x="20" y="45" width="50" height="25" rx="3" fill="white" />
          
          {/* Vehicle windows */}
          <rect x="25" y="50" width="12" height="10" rx="1" fill="#0d6efd" />
          <rect x="40" y="50" width="12" height="10" rx="1" fill="#0d6efd" />
          <rect x="55" y="50" width="12" height="10" rx="1" fill="#0d6efd" />
          
          {/* Wheels */}
          <circle cx="32" cy="75" r="6" fill="#333" />
          <circle cx="68" cy="75" r="6" fill="#333" />
          <circle cx="32" cy="75" r="3" fill="#666" />
          <circle cx="68" cy="75" r="3" fill="#666" />
          
          {/* Road lines */}
          <line x1="10" y1="80" x2="90" y2="80" stroke="white" strokeWidth="2" strokeDasharray="4,4" />
        </svg>
      </div>
      {showText && (
        <span 
          style={{ 
            fontSize: currentSize.text, 
            fontWeight: 700,
            color: 'inherit'
          }}
        >
          Prasanna Transport
        </span>
      )}
    </div>
  );
};

export default Logo;

