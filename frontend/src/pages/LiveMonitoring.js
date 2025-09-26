import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
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

const LiveMonitoringContainer = styled.div`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  padding: 20px;
  color: white;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #10b981, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionDescription = styled.p`
  text-align: center;
  color: #94a3b8;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
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

    .icon {
      font-size: 1.2rem;
    }
  }
`;

const MapCard = styled(Card)`
  height: 500px;
  padding: 0;
  overflow: hidden;

  .map-header {
    padding: 20px 25px;
    border-bottom: 1px solid rgba(16, 185, 129, 0.2);

    h3 {
      margin: 0;
    }
  }

  .map-container {
    height: calc(100% - 80px);
    
    .leaflet-container {
      height: 100%;
      background: #0f172a;
    }
  }
`;

const SensorStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const SensorCard = styled.div`
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

  .sensor-icon {
    width: 40px;
    height: 40px;
    background: ${props => props.status === 'NORMAL' ? '#10b981' : 
                          props.status === 'WARNING' ? '#f59e0b' : 
                          '#ef4444'};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin: 0 auto 10px;
  }

  .sensor-label {
    font-size: 0.9rem;
    color: #94a3b8;
    margin-bottom: 5px;
  }

  .sensor-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 5px;
  }

  .sensor-status {
    font-size: 0.8rem;
    color: ${props => props.status === 'NORMAL' ? '#10b981' : 
                     props.status === 'WARNING' ? '#f59e0b' : 
                     '#ef4444'};
    font-weight: 500;
  }
`;

const PredictionPanel = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;

  .prediction-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h4 {
      color: white;
      font-size: 1.1rem;
      margin: 0;
    }

    .confidence {
      color: #10b981;
      font-size: 0.9rem;
      font-weight: 500;
    }
  }

  .prediction-item {
    margin-bottom: 15px;

    .prediction-label {
      color: #94a3b8;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }

    .prediction-bar {
      background: rgba(30, 58, 95, 0.5);
      height: 8px;
      border-radius: 4px;
      overflow: hidden;

      .prediction-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }

    .prediction-value {
      color: white;
      font-size: 0.8rem;
      margin-top: 5px;
    }
  }
`;

// Custom markers for different sensor statuses
const createCustomIcon = (status) => {
  const color = status === 'NORMAL' ? '#10b981' : 
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
        animation: ${status !== 'NORMAL' ? 'pulse 2s infinite' : 'none'};
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

const LiveMonitoring = () => {
  const [sensorData, setSensorData] = useState([]);
  const [latestReading, setLatestReading] = useState(null);
  const [chartData, setChartData] = useState({
    voltage: { labels: [], datasets: [] },
    current: { labels: [], datasets: [] },
    vibration: { labels: [], datasets: [] }
  });

  // Mock sensor locations (you can replace with actual coordinates)
  const sensorLocations = [
    { id: 1, name: 'Sensor 1', lat: 40.7831, lng: -73.9712, status: 'WARNING' },
    { id: 2, name: 'Sensor 2', lat: 40.7589, lng: -73.9851, status: 'NORMAL' },
    { id: 3, name: 'Sensor 3', lat: 40.7505, lng: -73.9934, status: 'NORMAL' },
    { id: 4, name: 'Sensor 4', lat: 40.7614, lng: -73.9776, status: 'CRITICAL' }
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
            vibration: {
              labels: ['0-0.5g', '0.5-1g', '1-1.5g', '1.5-2g'],
              datasets: [{
                data: [70, 20, 8, 2],
                backgroundColor: [
                  '#10b981',
                  '#34d399',
                  '#f59e0b',
                  '#ef4444'
                ],
                borderWidth: 0
              }]
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
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

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 20
        }
      }
    }
  };

  return (
    <LiveMonitoringContainer>
      <Content>
        <Section>
          <SectionTitle>Live Monitoring</SectionTitle>
          <SectionDescription>
            Real-time monitoring of distributed power infrastructure
          </SectionDescription>
        </Section>

        <TopSection>
          <MapCard>
            <div className="map-header">
              <h3>
                <span className="icon">🗺️</span>
                Power Line Status Map
              </h3>
            </div>
            <div className="map-container">
              <MapContainer 
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
                          color: sensor.status === 'NORMAL' ? '#10b981' : 
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
              </MapContainer>
            </div>
          </MapCard>

          <Card>
            <h3>
              <span className="icon">📊</span>
              Live Sensor Readings
            </h3>
            <SensorStatusGrid>
              <SensorCard status="NORMAL">
                <div className="sensor-icon">⚡</div>
                <div className="sensor-label">Voltage</div>
                <div className="sensor-value">{latestReading?.voltage || '230.2'} V</div>
                <div className="sensor-status">NORMAL</div>
              </SensorCard>
              
              <SensorCard status="WARNING">
                <div className="sensor-icon">🔄</div>
                <div className="sensor-label">Current</div>
                <div className="sensor-value">{latestReading?.current || '14.2'} A</div>
                <div className="sensor-status">WARNING</div>
              </SensorCard>
              
              <SensorCard status="NORMAL">
                <div className="sensor-icon">📳</div>
                <div className="sensor-label">Vibration</div>
                <div className="sensor-value">{latestReading?.vibration || '0.32'} g</div>
                <div className="sensor-status">NORMAL</div>
              </SensorCard>
            </SensorStatusGrid>

            <PredictionPanel>
              <div className="prediction-header">
                <h4>🤖 AI Predictions</h4>
                <span className="confidence">87% Confidence</span>
              </div>
              
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
                <div className="prediction-label">Estimated Time to Failure</div>
                <div className="prediction-bar">
                  <div className="prediction-fill" style={{ width: '80%' }}></div>
                </div>
                <div className="prediction-value">6+ Months</div>
              </div>
            </PredictionPanel>
          </Card>
        </TopSection>

        <Section>
          <SectionTitle>Intelligent Monitoring System</SectionTitle>
          <SectionDescription>
            Advanced AI-powered alert system with predictive analytics for proactive maintenance and fault prevention
          </SectionDescription>
        </Section>

        <ChartsGrid>
          <Card>
            <h3>
              <span className="icon">⚡</span>
              Voltage Monitoring
            </h3>
            <div style={{ height: '300px' }}>
              <Line data={chartData.voltage} options={chartOptions} />
            </div>
          </Card>

          <Card>
            <h3>
              <span className="icon">🔄</span>
              Current Analysis
            </h3>
            <div style={{ height: '300px' }}>
              <Line data={chartData.current} options={chartOptions} />
            </div>
          </Card>

          <Card>
            <h3>
              <span className="icon">📳</span>
              Vibration Distribution
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut data={chartData.vibration} options={pieOptions} />
            </div>
          </Card>

          <Card>
            <h3>
              <span className="icon">📊</span>
              Performance Analytics
            </h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📈</div>
                <div>Real-time data visualization and trend analysis for comprehensive power line monitoring</div>
                <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
                  <div>• System Status: <span style={{ color: '#10b981' }}>OPTIMAL</span></div>
                  <div>• Last Updated: 12/09/2025, 00:25:36</div>
                  <div>• Active Sensors: 3</div>
                </div>
              </div>
            </div>
          </Card>
        </ChartsGrid>
      </Content>
    </LiveMonitoringContainer>
  );
};

export default LiveMonitoring;
