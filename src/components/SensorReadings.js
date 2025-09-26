import React from 'react';

const SensorCard = ({ title, value, unit, status, icon }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-green border-emerald-green';
      case 'warning':
        return 'text-yellow-500 border-yellow-500';
      case 'critical':
        return 'text-red-500 border-red-500';
      default:
        return 'text-white border-white';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'normal':
        return 'from-emerald-green/20';
      case 'warning':
        return 'from-yellow-500/20';
      case 'critical':
        return 'from-red-500/20';
      default:
        return 'from-white/20';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getStatusBg(status)} via-deep-blue/20 to-white/10 rounded-2xl p-8 backdrop-blur-md border-2 ${getStatusColor(status)} transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${getStatusBg(status)} via-transparent to-transparent shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className={`text-3xl ${getStatusColor(status)} drop-shadow-lg`}>{icon}</div>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(status)} bg-white/20 backdrop-blur-sm shadow-lg border border-white/30`}>
          {status.toUpperCase()}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-3 tracking-wide">{title}</h3>
      
      <div className="flex items-baseline space-x-2 mb-4">
        <span className="text-2xl font-bold text-white drop-shadow-lg">{value}</span>
        <span className="text-lg text-gray-200 font-medium">{unit}</span>
      </div>
      
      <div className="mt-6 h-3 bg-white/30 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full bg-gradient-to-r ${getStatusColor(status).replace('text-', 'from-').replace(' border-', ' to-')} transition-all duration-700 shadow-lg rounded-full`}
          style={{ width: `${Math.min((value / getMaxValue(title)) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

const getMaxValue = (title) => {
  switch (title.toLowerCase()) {
    case 'voltage':
      return 250;
    case 'current':
      return 20;
    case 'vibration':
      return 1;
    default:
      return 100;
  }
};

const getStatus = (title, value) => {
  switch (title.toLowerCase()) {
    case 'voltage':
      if (value < 210 || value > 245) return 'critical';
      if (value < 220 || value > 240) return 'warning';
      return 'normal';
    case 'current':
      if (value > 16) return 'critical';
      if (value > 12) return 'warning';
      return 'normal';
    case 'vibration':
      if (value > 0.8) return 'critical';
      if (value > 0.5) return 'warning';
      return 'normal';
    default:
      return 'normal';
  }
};

const SensorReadings = ({ sensorData }) => {
  const latestData = sensorData && sensorData.length > 0 
    ? sensorData[sensorData.length - 1]
    : { voltage: 230, current: 12.5, vibration: 0.3, timestamp: new Date() };

  const sensors = [
    {
      title: 'Voltage',
      value: latestData.voltage.toFixed(1),
      unit: 'V',
      status: getStatus('voltage', latestData.voltage),
      icon: '⚡'
    },
    {
      title: 'Current',
      value: latestData.current.toFixed(1),
      unit: 'A',
      status: getStatus('current', latestData.current),
      icon: '🔌'
    },
    {
      title: 'Vibration',
      value: latestData.vibration.toFixed(2),
      unit: 'g',
      status: getStatus('vibration', latestData.vibration),
      icon: '📳'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-deep-blue/60 via-emerald-green/30 to-slate-700/20 rounded-3xl p-8 backdrop-blur-md border border-gray-400/40 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
              Live Sensor Readings
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-green to-deep-blue mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sensors.map((sensor, index) => (
            <SensorCard
              key={index}
              title={sensor.title}
              value={sensor.value}
              unit={sensor.unit}
              status={sensor.status}
              icon={sensor.icon}
            />
          ))}
        </div>
        
        <div className="mt-6 text-center bg-gray-500/10 rounded-2xl p-4 backdrop-blur-sm border border-gray-400/20">
          <p className="text-white font-medium text-base mb-1">
            System Status: <span className="text-emerald-green">ACTIVE</span>
          </p>
          <p className="text-gray-200 text-sm">
            Last updated: {new Date(latestData.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SensorReadings;
