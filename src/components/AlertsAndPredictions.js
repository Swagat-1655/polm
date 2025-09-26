import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimes, 
  FaInfoCircle,
  FaRobot,
  FaBell,
  FaMapMarkerAlt
} from 'react-icons/fa';

const AlertItem = ({ alert, index }) => {
  const getAlertColor = (severity) => {
    switch (severity) {
      case 'fault':
      case 'critical':
        return 'border-red-400 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 shadow-glow glow-border';
      case 'warning':
        return 'border-yellow-400 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 shadow-glow glow-border';
      case 'clear':
      case 'info':
        return 'border-green-400 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300 shadow-glow glow-border';
      default:
        return 'border-blue-400 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 shadow-glow glow-border';
    }
  };

  const getIcon = (severity) => {
    const iconClass = "text-2xl";
    switch (severity) {
      case 'fault':
      case 'critical':
        return <FaTimes className={`${iconClass} text-red-400`} />;
      case 'warning':
        return <FaExclamationTriangle className={`${iconClass} text-yellow-400`} />;
      case 'clear':
      case 'info':
        return <FaCheckCircle className={`${iconClass} text-green-400`} />;
      default:
        return <FaInfoCircle className={`${iconClass} text-blue-400`} />;
    }
  };

  return (
    <div className={`alert-item border-l-4 ${getAlertColor(alert.severity)} p-4 mb-3 rounded-xl transition-all duration-300 hover:shadow-lg bg-black/30 backdrop-blur-sm`}>
      <div className="flex items-start space-x-3">
        <div className="pt-1">{getIcon(alert.severity)}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white">
              {alert.title}
            </h4>
            <span className="text-xs font-bold opacity-90 text-white">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm mt-2 font-medium text-gray-200">{alert.message}</p>
          {alert.location && (
            <div className="text-xs mt-2 font-medium text-white bg-black/20 inline-flex items-center gap-1 px-2 py-1 rounded">
              <FaMapMarkerAlt className="text-blue-400" /> {alert.location}
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs px-2 py-1 rounded-full font-bold bg-white/10 text-white">
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-xs font-medium text-gray-300">ID: {alert.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertSystem = ({ sensorData }) => {
  const [alerts, setAlerts] = useState([
    {
      id: 'A001',
      title: 'High Current Detected',
      message: 'Current reading exceeded normal threshold (>15A)',
      severity: 'warning',
      location: 'Pole 2 - Thiruvananthapuram',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: 'A002',
      title: 'Line Break Fault',
      message: 'Critical fault detected - immediate attention required',
      severity: 'fault',
      location: 'Pole 3 - Kozhikode',
      timestamp: new Date(Date.now() - 600000) // 10 minutes ago
    },
    {
      id: 'A003',
      title: 'Voltage Fluctuation Alert',
      message: 'Minor voltage variations detected in the grid',
      severity: 'info',
      location: 'Pole 1 - Kochi',
      timestamp: new Date(Date.now() - 900000) // 15 minutes ago
    },
    {
      id: 'A004',
      title: 'Power Restored',
      message: 'Power supply restored after maintenance',
      severity: 'clear',
      location: 'Pole 5 - Alappuzha',
      timestamp: new Date(Date.now() - 1200000) // 20 minutes ago
    },
    {
      id: 'A005',
      title: 'Overload Warning',
      message: 'Power consumption approaching maximum capacity',
      severity: 'warning',
      location: 'Pole 4 - Thrissur',
      timestamp: new Date(Date.now() - 1500000) // 25 minutes ago
    },
    {
      id: 'A006',
      title: 'System Health Check',
      message: 'Regular system monitoring - all parameters normal',
      severity: 'info',
      location: 'Kerala Network',
      timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
    }
  ]);
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    if (sensorData && sensorData.length > 0) {
      setIsLoading(true);
      const latestData = sensorData[sensorData.length - 1];
      const newAlerts = [];

      // Check voltage
      if (latestData.voltage < 210 || latestData.voltage > 245) {
        newAlerts.push({
          id: `V${Date.now()}`,
          title: 'Critical Voltage Fault',
          message: `Voltage reading: ${latestData.voltage}V is outside safe range (210-245V)`,
          severity: 'fault',
          location: 'Pole 1 - Kochi',
          timestamp: new Date()
        });
      } else if (latestData.voltage < 220 || latestData.voltage > 240) {
        newAlerts.push({
          id: `V${Date.now()}`,
          title: 'Voltage Warning',
          message: `Voltage reading: ${latestData.voltage}V approaching limits`,
          severity: 'warning',
          location: 'Pole 1 - Kochi',
          timestamp: new Date()
        });
      }

      // Check current
      if (latestData.current > 16) {
        newAlerts.push({
          id: `C${Date.now()}`,
          title: 'Line Break Fault',
          message: `Current reading: ${latestData.current}A exceeds maximum safe level - Line break detected`,
          severity: 'fault',
          location: 'Pole 3 - Kozhikode',
          timestamp: new Date()
        });
      } else if (latestData.current > 12) {
        newAlerts.push({
          id: `C${Date.now()}`,
          title: 'High Current Warning',
          message: `Current reading: ${latestData.current}A is elevated`,
          severity: 'warning',
          location: 'Pole 2 - Thiruvananthapuram',
          timestamp: new Date()
        });
      }

      // Check vibration
      if (latestData.vibration > 0.8) {
        newAlerts.push({
          id: `VIB${Date.now()}`,
          title: 'Structural Fault Alert',
          message: `High vibration detected: ${latestData.vibration}g - Check for structural issues`,
          severity: 'fault',
          location: 'Pole 4 - Thrissur',
          timestamp: new Date()
        });
      }

      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 8)); // Keep only 8 alerts for better scrolling
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [sensorData]);

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] min-h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-blue-900/60 to-blue-800/40 rounded-xl p-4 mb-6 border border-blue-400/30">
        <h3 className="text-2xl font-bold text-white flex items-center drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
          <FaBell className="mr-3 text-2xl text-red-400" />
          System Alerts
        </h3>
      </div>
      <div className="alerts-scroll-container">
        {alerts && alerts.length > 0 ? (
          <div className="alerts-scroll-content space-y-3">
            {/* Duplicate alerts for seamless loop */}
            {alerts.concat(alerts).map((alert, index) => (
              <AlertItem 
                key={`${alert.id}-${index}`} 
                alert={alert} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-white">
            <div>
              <div className="mb-3">
                <FaCheckCircle className="text-4xl text-green-400 mx-auto" />
              </div>
              <p className="font-bold text-lg">No alerts at this time</p>
              <p className="text-sm font-semibold opacity-80 text-gray-300">All systems operating normally</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AIPredictions = ({ sensorData }) => {
  const [predictions, setPredictions] = useState({
    lineBreakProbability: 0.15,
    maintenanceRequired: 'Low Priority',
    estimatedTimeToFailure: '45+ days',
    recommendedActions: [
      'Continue regular monitoring',
      'Schedule routine inspection next month'
    ]
  });

  useEffect(() => {
    if (sensorData && sensorData.length > 0) {
      const latestData = sensorData[sensorData.length - 1];
      
      // Simple AI prediction algorithm
      let probability = 0;
      let priority = 'Low Priority';
      let timeToFailure = '45+ days';
      let actions = ['Continue regular monitoring'];

      // Calculate risk based on sensor values
      if (latestData.voltage < 220 || latestData.voltage > 240) probability += 0.3;
      if (latestData.current > 12) probability += 0.4;
      if (latestData.vibration > 0.5) probability += 0.3;

      // Determine maintenance priority
      if (probability > 0.7) {
        priority = 'High Priority';
        timeToFailure = '7-14 days';
        actions = [
          'Immediate inspection required',
          'Prepare maintenance team',
          'Consider load reduction'
        ];
      } else if (probability > 0.4) {
        priority = 'Medium Priority';
        timeToFailure = '14-30 days';
        actions = [
          'Schedule inspection within 2 weeks',
          'Monitor closely',
          'Check connections'
        ];
      } else {
        actions = [
          'Continue regular monitoring',
          'Schedule routine inspection next month'
        ];
      }

      setPredictions({
        lineBreakProbability: Math.min(probability, 0.95),
        maintenanceRequired: priority,
        estimatedTimeToFailure: timeToFailure,
        recommendedActions: actions
      });
    }
  }, [sensorData]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High Priority':
        return 'text-red-800 bg-gradient-to-r from-red-100 to-red-200 border-red-400';
      case 'Medium Priority':
        return 'text-yellow-800 bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400';
      default:
        return 'text-green-800 bg-gradient-to-r from-green-100 to-green-200 border-green-400';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] min-h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-blue-900/60 to-blue-800/40 rounded-xl p-4 mb-6 border border-blue-400/30">
        <h3 className="text-2xl font-bold text-white flex items-center drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
          <FaRobot className="mr-3 text-2xl text-blue-400" />
          AI Predictions
        </h3>
      </div>
      
      <div className="space-y-4 flex-1">
        {/* Probability Meter */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md glow-border">
          <h4 className="text-white font-bold mb-2">Line Break Probability</h4>
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                predictions.lineBreakProbability > 0.7 ? 'bg-red-500' : 
                predictions.lineBreakProbability > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${predictions.lineBreakProbability * 100}%` }}
            ></div>
          </div>
          <p className="text-right text-white text-sm mt-1 font-bold">
            {(predictions.lineBreakProbability * 100).toFixed(1)}%
          </p>
        </div>

        {/* Maintenance Priority */}
        <div className={`rounded-lg p-4 border-2 shadow-lg ${getPriorityColor(predictions.maintenanceRequired)}`}>
          <h4 className="font-bold mb-1">Maintenance Required</h4>
          <p className="text-lg font-bold">{predictions.maintenanceRequired}</p>
        </div>

        {/* Time to Failure */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md glow-border">
          <h4 className="text-white font-bold mb-1">Estimated Time to Failure</h4>
          <p className="text-lg font-bold text-green-300">{predictions.estimatedTimeToFailure}</p>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md glow-border">
          <h4 className="text-white font-bold mb-3">Recommended Actions</h4>
          <ul className="space-y-2">
            {predictions.recommendedActions.map((action, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-300 mr-2 font-bold">•</span>
                <span className="text-gray-200 text-sm font-semibold">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Confidence */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md glow-border">
          <h4 className="text-white font-bold mb-1">AI Confidence Level</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-3 bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-green-400" style={{ width: '87%' }}></div>
            </div>
            <span className="text-green-300 text-sm font-bold">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AlertSystem, AIPredictions };
