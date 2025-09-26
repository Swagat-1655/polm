import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Ring } from '@react-three/drei';
import { Line, Scatter } from 'react-chartjs-2';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { sensorAPI, utils } from '../api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Animations
const glow = keyframes`
  0%, 100% { text-shadow: 0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981; }
  50% { text-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981; }
`;

const pulse = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  padding: 20px;
  color: white;
`;

const DashboardContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// Hero Section
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
  min-height: 500px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${glow} 3s ease-in-out infinite;
  margin-bottom: 20px;
  line-height: 1.1;
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: #94a3b8;
  line-height: 1.6;
  animation: ${float} 4s ease-in-out infinite;
`;

const HeroRight = styled.div`
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.8);
  position: relative;
  border: 1px solid rgba(16, 185, 129, 0.2);
  backdrop-filter: blur(10px);

  .status-indicator {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(16, 185, 129, 0.2);
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: white;
    z-index: 10;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
`;

const CurrentStatus = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
`;

const StatusCard = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.status === 'NORMAL' ? 'rgba(16, 185, 129, 0.2)' : 
              props.status === 'WARNING' ? 'rgba(245, 158, 11, 0.2)' : 
              'rgba(239, 68, 68, 0.2)'}, 
    ${props => props.status === 'NORMAL' ? 'rgba(5, 150, 105, 0.1)' : 
              props.status === 'WARNING' ? 'rgba(217, 119, 6, 0.1)' : 
              'rgba(220, 38, 38, 0.1)'});
  border: 1px solid ${props => props.status === 'NORMAL' ? '#10b981' : 
                               props.status === 'WARNING' ? '#f59e0b' : 
                               '#ef4444'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 10px;
    display: block;
  }

  .value {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 5px;
  }

  .label {
    font-size: 0.9rem;
    color: #94a3b8;
  }
`;

// Map Section
const MapSection = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MapContainer = styled.div`
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: rgba(15, 23, 42, 0.8);
  
  .leaflet-container {
    height: 100%;
    background: #0f172a !important;
  }
`;

// Performance Analysis Section
const PerformanceSection = styled.section`
  margin-bottom: 60px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.8), rgba(45, 90, 135, 0.6));
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(10px);

  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    color: white;
    text-align: center;
  }

  .chart-container {
    height: 250px;
    width: 100%;
  }
`;

// Alerts and AI Section
const AlertsAISection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const AlertCard = styled.div`
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.8), rgba(45, 90, 135, 0.6));
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(10px);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const AlertItem = styled.div`
  background: ${props => 
    props.status === 'CLEAR' ? 'rgba(16, 185, 129, 0.1)' :
    props.status === 'WARNING' ? 'rgba(245, 158, 11, 0.1)' :
    'rgba(239, 68, 68, 0.1)'};
  border-left: 4px solid ${props => 
    props.status === 'CLEAR' ? '#10b981' :
    props.status === 'WARNING' ? '#f59e0b' :
    '#ef4444'};
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;

  .alert-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .alert-title {
      font-weight: 600;
      color: white;
    }

    .alert-time {
      color: #94a3b8;
      font-size: 0.85rem;
    }
  }

  .alert-message {
    color: #cbd5e1;
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .alert-status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${props => 
      props.status === 'CLEAR' ? '#10b981' :
      props.status === 'WARNING' ? '#f59e0b' :
      '#ef4444'};
    color: white;
  }
`;

const PredictionPanel = styled.div`
  .prediction-item {
    margin-bottom: 20px;

    .prediction-label {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .prediction-bar {
      background: rgba(30, 58, 95, 0.5);
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 5px;

      .prediction-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: 5px;
        transition: width 0.3s ease;
      }
    }

    .prediction-value {
      color: white;
      font-size: 0.9rem;
    }
  }
`;

// System Status Overview Section
const StatusOverviewSection = styled.section`
  margin-bottom: 60px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.8), rgba(45, 90, 135, 0.6));
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
    border-color: rgba(16, 185, 129, 0.4);
  }

  .icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #10b981, #34d399);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 20px;
    animation: ${pulse} 2s ease-in-out infinite;
  }

  .value {
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 10px;
  }

  .label {
    font-size: 1rem;
    color: #94a3b8;
    margin-bottom: 5px;
  }

  .sublabel {
    font-size: 0.85rem;
    color: #64748b;
  }
`;

// Footer
const Footer = styled.footer`
  background: rgba(15, 23, 42, 0.9);
  border-top: 1px solid rgba(16, 185, 129, 0.2);
  padding: 40px 20px;
  text-align: center;
  margin-top: 60px;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .footer-section h4 {
    color: #10b981;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  .footer-section p, .footer-section a {
    color: #94a3b8;
    text-decoration: none;
    line-height: 1.6;
  }

  .footer-section a:hover {
    color: #10b981;
  }

  .footer-bottom {
    border-top: 1px solid rgba(16, 185, 129, 0.2);
    padding-top: 20px;
    color: #64748b;
    font-size: 0.9rem;
  }
`;

// Custom markers for different power line statuses
const createCustomIcon = (status) => {
  const color = status === 'CLEAR' ? '#10b981' : 
                status === 'WARNING' ? '#f59e0b' : '#ef4444';
  
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        animation: ${status !== 'CLEAR' ? 'pulse 2s infinite' : 'none'};
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// 3D Current Flow Visualization Component
const CurrentFlowVisualization = ({ currentValue }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const ElectronOrbit = ({ radius, speed, count }) => {
    const electrons = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time * speed;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      electrons.push(
        <Sphere key={i} position={[x, y, 0]} args={[0.03]}>
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
        </Sphere>
      );
    }
    return electrons;
  };

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Central core */}
      <Sphere args={[0.3]}>
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.2} />
      </Sphere>

      {/* Electron orbits */}
      <Ring args={[0.8, 0.82, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.3} />
      </Ring>
      <Ring args={[1.2, 1.22, 32]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.2} />
      </Ring>
      <Ring args={[1.6, 1.62, 32]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.1} />
      </Ring>

      {/* Electrons */}
      <ElectronOrbit radius={0.8} speed={2} count={3} />
      <ElectronOrbit radius={1.2} speed={1.5} count={5} />
      <ElectronOrbit radius={1.6} speed={1} count={7} />
    </>
  );
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState({
    voltage: { labels: [], datasets: [] },
    current: { labels: [], datasets: [] },
    faultPrediction: { labels: [], datasets: [] }
  });

  // Mock sensor locations
  const sensorLocations = [
    { id: 1, name: 'Power Line Sensor 1', lat: 40.7831, lng: -73.9712, status: 'WARNING' },
    { id: 2, name: 'Power Line Sensor 2', lat: 40.7589, lng: -73.9851, status: 'CLEAR' },
    { id: 3, name: 'Power Line Sensor 3', lat: 40.7505, lng: -73.9934, status: 'CLEAR' },
    { id: 4, name: 'Power Line Sensor 4', lat: 40.7614, lng: -73.9776, status: 'FAULT' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sensorAPI.getAllSensorData();
        setSensorData(data);
        
        if (data.length > 0) {
          const latest = data[data.length - 1];
          setLatestReading(latest);
          
          // Prepare chart data (last 10 readings)
          const recentData = data.slice(-10);
          const labels = recentData.map((_, index) => `${index + 1}m ago`);
          
          // Generate fault prediction data
          const faultPredictionData = labels.map((_, index) => {
            return Math.random() * 0.8 + 0.1; // Random values between 0.1 and 0.9
          });
          
          setChartData({
            voltage: {
              labels,
              datasets: [{
                label: 'Voltage (V)',
                data: recentData.map(d => parseFloat(d.voltage)),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            current: {
              labels,
              datasets: [{
                label: 'Current (A)',
                data: recentData.map(d => parseFloat(d.current)),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            faultPrediction: {
              labels,
              datasets: [{
                label: 'Fault Probability',
                data: faultPredictionData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: false,
                tension: 0.4
              }]
            }
          });
          
          // Generate alerts based on latest reading
          const alertLevel = utils.getAlertLevel(latest.voltage, latest.current, latest.vibration);
          if (alertLevel !== 'NORMAL') {
            const newAlert = {
              id: Date.now(),
              status: alertLevel === 'CRITICAL' ? 'FAULT' : 'WARNING',
              title: alertLevel === 'CRITICAL' ? 'Critical Power Line Fault' : 'Power Line Warning',
              message: `Current reading: ${latest.current}A ${alertLevel === 'CRITICAL' ? 'exceeds maximum safe level' : 'is elevated'}`,
              timestamp: new Date()
            };
            setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Generate mock data for demo
        const mockData = Array.from({ length: 10 }, (_, i) => ({
          voltage: (220 + Math.random() * 20).toFixed(1),
          current: (10 + Math.random() * 10).toFixed(2),
          vibration: (Math.random() * 2).toFixed(3),
          timestamp: new Date(Date.now() - i * 60000)
        }));
        setSensorData(mockData);
        setLatestReading(mockData[0]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      }
    }
  };

  const stats = [
    {
      icon: '📊',
      value: sensorData.length || 3,
      label: 'Total Sensors',
      sublabel: 'Active monitoring'
    },
    {
      icon: '⚡',
      value: 4,
      label: 'Active Points',
      sublabel: 'Power line nodes'
    },
    {
      icon: '📈',
      value: 847,
      label: 'Data Points',
      sublabel: 'Collected today'
    },
    {
      icon: '🔄',
      value: '00:26:06',
      label: 'Last Update',
      sublabel: 'System sync'
    }
  ];

  const mockAlerts = [
    {
      id: 1,
      status: 'WARNING',
      title: 'High Current Warning',
      message: 'Current reading: 14.23A is elevated on Line 2',
      timestamp: new Date()
    },
    {
      id: 2,
      status: 'CLEAR',
      title: 'Line Status Normal',
      message: 'All parameters within normal ranges on Line 1',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 3,
      status: 'FAULT',
      title: 'Critical Fault Detected',
      message: 'Voltage spike detected on Line 4 - immediate attention required',
      timestamp: new Date(Date.now() - 600000)
    }
  ];

  return (
    <DashboardContainer>
      <DashboardContent>
        {/* Hero Section */}
        <HeroSection>
          <HeroLeft>
            <HeroTitle>Advanced Power Line Monitoring</HeroTitle>
            <HeroSubtitle>
              Real-time monitoring powered by IoT sensors and artificial intelligence for comprehensive power grid management
            </HeroSubtitle>
            
            <CurrentStatus>
              <StatusCard status="NORMAL">
                <span className="icon">⚡</span>
                <div className="value">{latestReading?.voltage || '230.2'} V</div>
                <div className="label">Voltage</div>
              </StatusCard>
              
              <StatusCard status="WARNING">
                <span className="icon">🔄</span>
                <div className="value">{latestReading?.current || '14.2'} A</div>
                <div className="label">Current</div>
              </StatusCard>
              
              <StatusCard status="NORMAL">
                <span className="icon">📳</span>
                <div className="value">{latestReading?.vibration || '0.32'} g</div>
                <div className="label">Vibration</div>
              </StatusCard>
            </CurrentStatus>
          </HeroLeft>

          <HeroRight>
            <div className="status-indicator">14.2A Current Flow</div>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <CurrentFlowVisualization currentValue={latestReading?.current || 14.2} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </HeroRight>
        </HeroSection>

        {/* Map Section */}
        <MapSection>
          <SectionTitle>Power Line Network</SectionTitle>
          <MapContainer>
            <LeafletMapContainer 
              center={[40.7589, -73.9851]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {sensorLocations.map(sensor => (
                <Marker
                  key={sensor.id}
                  position={[sensor.lat, sensor.lng]}
                  icon={createCustomIcon(sensor.status)}
                >
                  <Popup>
                    <div style={{ color: '#1f2937', textAlign: 'center' }}>
                      <strong>{sensor.name}</strong><br/>
                      Status: <span style={{ 
                        color: sensor.status === 'CLEAR' ? '#10b981' : 
                              sensor.status === 'WARNING' ? '#f59e0b' : '#ef4444' 
                      }}>
                        {sensor.status}
                      </span><br/>
                      {latestReading && (
                        <>
                          Voltage: {latestReading.voltage}V<br/>
                          Current: {latestReading.current}A<br/>
                          Vibration: {latestReading.vibration}g
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </LeafletMapContainer>
          </MapContainer>
        </MapSection>

        {/* Performance Analysis Section */}
        <PerformanceSection>
          <SectionTitle>Performance Analysis</SectionTitle>
          <ChartsGrid>
            <ChartCard>
              <h3>Voltage vs Time</h3>
              <div className="chart-container">
                <Line data={chartData.voltage} options={chartOptions} />
              </div>
            </ChartCard>

            <ChartCard>
              <h3>Current vs Time</h3>
              <div className="chart-container">
                <Line data={chartData.current} options={chartOptions} />
              </div>
            </ChartCard>

            <ChartCard>
              <h3>Fault Prediction Probability</h3>
              <div className="chart-container">
                <Line data={chartData.faultPrediction} options={chartOptions} />
              </div>
            </ChartCard>
          </ChartsGrid>
        </PerformanceSection>

        {/* Alerts and AI Predictions Section */}
        <AlertsAISection>
          <AlertCard>
            <h3>
              <span>🚨</span>
              System Alerts
            </h3>
            {(alerts.length > 0 ? alerts : mockAlerts).map(alert => (
              <AlertItem key={alert.id} status={alert.status}>
                <div className="alert-header">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-time">{utils.formatTimestamp ? utils.formatTimestamp(alert.timestamp) : alert.timestamp.toLocaleTimeString()}</div>
                </div>
                <div className="alert-message">{alert.message}</div>
                <span className="alert-status">{alert.status}</span>
              </AlertItem>
            ))}
          </AlertCard>

          <AlertCard>
            <h3>
              <span>🤖</span>
              AI Predictions
            </h3>
            <PredictionPanel>
              <div className="prediction-item">
                <div className="prediction-label">Line Break Probability</div>
                <div className="prediction-bar">
                  <div className="prediction-fill" style={{ width: '40%' }}></div>
                </div>
                <div className="prediction-value">40.0% - Low Priority</div>
              </div>
              
              <div className="prediction-item">
                <div className="prediction-label">Maintenance Required</div>
                <div className="prediction-bar">
                  <div className="prediction-fill" style={{ width: '25%' }}></div>
                </div>
                <div className="prediction-value">Next Month</div>
              </div>
              
              <div className="prediction-item">
                <div className="prediction-label">Equipment Life Remaining</div>
                <div className="prediction-bar">
                  <div className="prediction-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="prediction-value">8.5 Years</div>
              </div>
              
              <div className="prediction-item">
                <div className="prediction-label">AI Confidence Level</div>
                <div className="prediction-bar">
                  <div className="prediction-fill" style={{ width: '87%' }}></div>
                </div>
                <div className="prediction-value">87% Accuracy</div>
              </div>
            </PredictionPanel>
          </AlertCard>
        </AlertsAISection>

        {/* System Status Overview */}
        <StatusOverviewSection>
          <SectionTitle>System Status Overview</SectionTitle>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <div className="icon">{stat.icon}</div>
                <div className="value">{stat.value}</div>
                <div className="label">{stat.label}</div>
                <div className="sublabel">{stat.sublabel}</div>
              </StatCard>
            ))}
          </StatsGrid>
        </StatusOverviewSection>
      </DashboardContent>

      {/* Footer */}
      <Footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>PowerLine Monitor</h4>
            <p>Advanced IoT-powered monitoring system for modern power grid infrastructure.</p>
            <p>Real-time analytics • Predictive maintenance • AI-driven insights</p>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <p><a href="#">Real-time Monitoring</a></p>
            <p><a href="#">Fault Detection</a></p>
            <p><a href="#">Predictive Analytics</a></p>
            <p><a href="#">Smart Alerts</a></p>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <p><a href="#">Documentation</a></p>
            <p><a href="#">API Reference</a></p>
            <p><a href="#">Contact Support</a></p>
            <p><a href="#">System Status</a></p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2025 PowerLine Monitor. All rights reserved. | Built with React, Three.js, and Chart.js</p>
        </div>
      </Footer>
    </DashboardContainer>
  );
};

export default Dashboard;
