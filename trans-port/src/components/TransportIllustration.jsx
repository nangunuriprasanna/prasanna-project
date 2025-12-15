import React from 'react';

const TransportIllustration = ({ type = 'general', size = 'medium' }) => {
  const sizes = {
    small: { width: 100, height: 80 },
    medium: { width: 200, height: 160 },
    large: { width: 300, height: 240 }
  };

  const currentSize = sizes[size] || sizes.medium;

  const illustrations = {
    general: (
      <svg width={currentSize.width} height={currentSize.height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Road */}
        <rect x="0" y="140" width="200" height="20" fill="#4a5568" />
        <line x1="0" y1="150" x2="200" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,10" />
        
        {/* Bus */}
        <rect x="30" y="80" width="80" height="50" rx="5" fill="#3b82f6" />
        <rect x="35" y="85" width="12" height="12" rx="2" fill="#1e40af" />
        <rect x="50" y="85" width="12" height="12" rx="2" fill="#1e40af" />
        <rect x="65" y="85" width="12" height="12" rx="2" fill="#1e40af" />
        <rect x="80" y="85" width="12" height="12" rx="2" fill="#1e40af" />
        <rect x="95" y="90" width="8" height="30" rx="2" fill="#1e40af" />
        <circle cx="50" cy="135" r="8" fill="#1f2937" />
        <circle cx="90" cy="135" r="8" fill="#1f2937" />
        
        {/* Car */}
        <rect x="120" y="100" width="50" height="30" rx="5" fill="#ef4444" />
        <rect x="125" y="105" width="15" height="12" rx="2" fill="#991b1b" />
        <rect x="145" y="105" width="15" height="12" rx="2" fill="#991b1b" />
        <circle cx="135" cy="130" r="6" fill="#1f2937" />
        <circle cx="155" cy="130" r="6" fill="#1f2937" />
        
        {/* Sun */}
        <circle cx="180" cy="30" r="20" fill="#fbbf24" opacity="0.8" />
        <circle cx="180" cy="30" r="15" fill="#fcd34d" />
      </svg>
    ),
    bus: (
      <svg width={currentSize.width} height={currentSize.height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Road */}
        <rect x="0" y="140" width="200" height="20" fill="#4a5568" />
        <line x1="0" y1="150" x2="200" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,10" />
        
        {/* Large Bus */}
        <rect x="20" y="60" width="120" height="70" rx="8" fill="#3b82f6" />
        <rect x="25" y="70" width="15" height="15" rx="2" fill="#1e40af" />
        <rect x="45" y="70" width="15" height="15" rx="2" fill="#1e40af" />
        <rect x="65" y="70" width="15" height="15" rx="2" fill="#1e40af" />
        <rect x="85" y="70" width="15" height="15" rx="2" fill="#1e40af" />
        <rect x="105" y="70" width="15" height="15" rx="2" fill="#1e40af" />
        <rect x="125" y="75" width="10" height="40" rx="2" fill="#1e40af" />
        <rect x="20" y="60" width="15" height="50" rx="5" fill="#1e40af" opacity="0.5" />
        <circle cx="45" cy="135" r="10" fill="#1f2937" />
        <circle cx="115" cy="135" r="10" fill="#1f2937" />
        
        {/* Background elements */}
        <circle cx="180" cy="30" r="15" fill="#fbbf24" opacity="0.6" />
      </svg>
    ),
    car: (
      <svg width={currentSize.width} height={currentSize.height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Road */}
        <rect x="0" y="140" width="200" height="20" fill="#4a5568" />
        <line x1="0" y1="150" x2="200" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,10" />
        
        {/* Car */}
        <rect x="50" y="90" width="80" height="40" rx="8" fill="#ef4444" />
        <rect x="60" y="95" width="25" height="18" rx="3" fill="#991b1b" />
        <rect x="95" y="95" width="25" height="18" rx="3" fill="#991b1b" />
        <rect x="50" y="90" width="20" height="35" rx="5" fill="#991b1b" opacity="0.6" />
        <circle cx="70" cy="130" r="8" fill="#1f2937" />
        <circle cx="110" cy="130" r="8" fill="#1f2937" />
        
        {/* Background */}
        <circle cx="170" cy="40" r="12" fill="#3b82f6" opacity="0.3" />
      </svg>
    ),
    fleet: (
      <svg width={currentSize.width} height={currentSize.height} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Road */}
        <rect x="0" y="140" width="200" height="20" fill="#4a5568" />
        <line x1="0" y1="150" x2="200" y2="150" stroke="#fbbf24" strokeWidth="2" strokeDasharray="10,10" />
        
        {/* Multiple vehicles */}
        {/* Bus */}
        <rect x="10" y="70" width="50" height="60" rx="5" fill="#3b82f6" />
        <rect x="15" y="75" width="8" height="10" rx="1" fill="#1e40af" />
        <rect x="25" y="75" width="8" height="10" rx="1" fill="#1e40af" />
        <rect x="35" y="75" width="8" height="10" rx="1" fill="#1e40af" />
        <circle cx="25" cy="130" r="6" fill="#1f2937" />
        <circle cx="45" cy="130" r="6" fill="#1f2937" />
        
        {/* Car */}
        <rect x="70" y="100" width="40" height="30" rx="4" fill="#ef4444" />
        <rect x="75" y="105" width="12" height="10" rx="2" fill="#991b1b" />
        <rect x="90" y="105" width="12" height="10" rx="2" fill="#991b1b" />
        <circle cx="80" cy="128" r="5" fill="#1f2937" />
        <circle cx="100" cy="128" r="5" fill="#1f2937" />
        
        {/* Van */}
        <rect x="120" y="95" width="45" height="35" rx="4" fill="#10b981" />
        <rect x="125" y="100" width="10" height="8" rx="1" fill="#047857" />
        <rect x="138" y="100" width="10" height="8" rx="1" fill="#047857" />
        <circle cx="135" cy="128" r="5" fill="#1f2937" />
        <circle cx="155" cy="128" r="5" fill="#1f2937" />
      </svg>
    )
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {illustrations[type] || illustrations.general}
    </div>
  );
};

export default TransportIllustration;

