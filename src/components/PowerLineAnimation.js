import React, { useState, useEffect } from 'react';

const PowerLineAnimation = ({ status = 'normal' }) => {
  const [sparks, setSparks] = useState([]);
  const [swayAngle, setSwayAngle] = useState(0);

  useEffect(() => {
    // Sway animation for hanging lines
    const swayInterval = setInterval(() => {
      setSwayAngle(prev => prev + 0.05);
    }, 50);

    // Sparking animation when there's a fault
    let sparkInterval;
    if (status === 'fault') {
      sparkInterval = setInterval(() => {
        const newSparks = [];
        for (let i = 0; i < 8; i++) {
          newSparks.push({
            id: Math.random(),
            x: 240 + Math.random() * 120, // Around the break point
            y: 180 + Math.random() * 40,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            color: Math.random() > 0.5 ? '#ffd700' : '#ffaa00'
          });
        }
        setSparks(newSparks);
        
        setTimeout(() => setSparks([]), 150);
      }, 300);
    }

    return () => {
      clearInterval(swayInterval);
      if (sparkInterval) clearInterval(sparkInterval);
    };
  }, [status]);

  const getStatusColor = () => {
    switch (status) {
      case 'fault': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'normal': return '#10b981';
      default: return '#10b981';
    }
  };

  const swayOffset = Math.sin(swayAngle) * 15;

  return (
    <div className="w-full h-80 relative">
      {/* Very subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-blue-700/5 rounded-xl"></div>
      
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 320"
        className="relative z-10"
        style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
      >
        {/* Left Pole */}
        <rect
          x="80"
          y="60"
          width="12"
          height="200"
          fill="#8B4513"
          rx="2"
        />
        
        {/* Left Crossbeam */}
        <rect
          x="50"
          y="80"
          width="72"
          height="8"
          fill="#8B4513"
          rx="2"
        />
        
        {/* Left Insulators */}
        <circle cx="55" cy="84" r="4" fill="#4a5568" />
        <circle cx="70" cy="84" r="4" fill="#4a5568" />
        <circle cx="102" cy="84" r="4" fill="#4a5568" />
        <circle cx="117" cy="84" r="4" fill="#4a5568" />
        
        {/* Right Pole */}
        <rect
          x="508"
          y="60"
          width="12"
          height="200"
          fill="#8B4513"
          rx="2"
        />
        
        {/* Right Crossbeam */}
        <rect
          x="478"
          y="80"
          width="72"
          height="8"
          fill="#8B4513"
          rx="2"
        />
        
        {/* Right Insulators */}
        <circle cx="483" cy="84" r="4" fill="#4a5568" />
        <circle cx="498" cy="84" r="4" fill="#4a5568" />
        <circle cx="530" cy="84" r="4" fill="#4a5568" />
        <circle cx="545" cy="84" r="4" fill="#4a5568" />

        {/* Power Lines */}
        {status === 'normal' ? (
          // All lines intact when status is normal/clear
          <>
            {/* Top line */}
            <path
              d="M 55 88 Q 200 98 350 98 Q 450 98 545 88"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            {/* Middle line - fully connected */}
            <path
              d="M 70 88 Q 200 95 350 95 Q 450 95 530 88"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            {/* Bottom line */}
            <path
              d="M 102 88 Q 200 105 350 105 Q 450 105 483 88"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
          </>
        ) : (
          // Broken lines when status is warning or fault
          <>
            {/* Top line - intact */}
            <path
              d="M 55 88 Q 200 98 350 98 Q 450 98 545 88"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            />
            
            {/* Middle line - broken */}
            <path
              d="M 70 88 Q 150 95 230 95"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            
            {/* Hanging left part of broken line */}
            <path
              d={`M 230 95 Q ${240 + swayOffset} ${140 + Math.abs(swayOffset/2)} ${245 + swayOffset} ${170 + Math.abs(swayOffset/3)}`}
              stroke={status === 'fault' ? '#ef4444' : getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            
            {/* Hanging right part of broken line */}
            <path
              d={`M 370 95 Q ${360 - swayOffset} ${140 + Math.abs(swayOffset/2)} ${355 - swayOffset} ${170 + Math.abs(swayOffset/3)}`}
              stroke={status === 'fault' ? '#ef4444' : getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            
            {/* Right part of middle line */}
            <path
              d="M 370 95 Q 450 95 530 88"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.9"
            />
            
            {/* Bottom line - intact */}
            <path
              d="M 102 88 Q 200 105 350 105 Q 450 105 483 88"
              stroke={getStatusColor()}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            />
          </>
        )}

        {/* Sparks */}
        {sparks.map(spark => (
          <g key={spark.id}>
            <circle
              cx={spark.x}
              cy={spark.y}
              r={spark.size}
              fill={spark.color}
              opacity={spark.opacity}
            />
            <circle
              cx={spark.x + Math.random() * 6 - 3}
              cy={spark.y + Math.random() * 6 - 3}
              r={spark.size * 0.7}
              fill="#fff"
              opacity={spark.opacity * 0.8}
            />
          </g>
        ))}

        {/* Status indicator */}
        <circle
          cx="300"
          cy="30"
          r="8"
          fill={getStatusColor()}
          opacity="0.9"
        >
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      
      {/* Status Text */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-black/60 backdrop-blur-sm border border-blue-400/50 rounded-lg px-4 py-2 shadow-[0_0_10px_rgba(59,130,246,0.4)]">
          <p className="text-sm font-bold text-white">
            Line Status: <span style={{color: getStatusColor()}} className="font-bold drop-shadow-sm">
              {status.toUpperCase()}
            </span>
          </p>
        </div>
      </div>
      
      {/* Warning Text for Fault */}
      {status === 'fault' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-red-400 glow-border pulse-glow-enhanced">
            <p className="text-red-300 font-bold text-sm animate-pulse text-glow">
              ⚡ LINE BREAK DETECTED ⚡
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerLineAnimation;
