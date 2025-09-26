import React, { useRef, useEffect, useState } from 'react';
import { FaBolt, FaPlug, FaRobot } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const VoltageChart = ({ data }) => {
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance && chartInstance.chartInstance) {
        chartInstance.chartInstance.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-6 glow-border shadow-glow backdrop-blur-enhanced min-h-[300px] flex items-center justify-center">
        <div className="text-center text-white">
          <FaBolt className="text-4xl text-yellow-400 mb-4 mx-auto" />
          <p className="text-lg font-bold">No voltage data available</p>
        </div>
      </div>
    );
  }
  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Voltage (V)',
        data: data.map(item => item.voltage),
        borderColor: '#48cae4',
        backgroundColor: 'rgba(72, 202, 228, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#90e0ef',
        pointBorderColor: '#48cae4',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#caf0f8',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
      title: {
        display: true,
        text: 'Voltage vs Time',
        color: '#90e0ef',
        font: {
          size: 18,
          weight: 'bold'
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ade8f4',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(72, 202, 228, 0.2)',
        },
        title: {
          display: true,
          text: 'Voltage (V)',
          color: '#90e0ef',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        ticks: {
          color: '#ade8f4',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(72, 202, 228, 0.2)',
        },
        title: {
          display: true,
          text: 'Time',
          color: '#90e0ef',
          font: {
            weight: 'bold'
          }
        }
      },
    },
  };

  return (
    <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-6 glow-border shadow-glow backdrop-blur-enhanced min-h-[300px] professional-card">
      <div className="flex items-center gap-2 mb-4">
        <FaBolt className="text-yellow-400 text-xl" />
        <h3 className="text-white font-bold text-lg">Voltage Monitor</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-white font-bold">Loading chart...</div>
        </div>
      ) : (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  );
};

const CurrentChart = ({ data }) => {
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance && chartInstance.chartInstance) {
        chartInstance.chartInstance.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-6 glow-border shadow-glow backdrop-blur-enhanced min-h-[300px] flex items-center justify-center">
        <div className="text-center text-white">
          <FaPlug className="text-4xl text-blue-400 mb-4 mx-auto" />
          <p className="text-lg font-bold">No current data available</p>
        </div>
      </div>
    );
  }
  const chartData = {
    labels: data.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Current (A)',
        data: data.map(item => item.current),
        borderColor: '#00b4d8',
        backgroundColor: 'rgba(0, 180, 216, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#48cae4',
        pointBorderColor: '#00b4d8',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#caf0f8',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
      title: {
        display: true,
        text: 'Current vs Time',
        color: '#90e0ef',
        font: {
          size: 18,
          weight: 'bold'
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ade8f4',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 180, 216, 0.2)',
        },
        title: {
          display: true,
          text: 'Current (A)',
          color: '#90e0ef',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        ticks: {
          color: '#ade8f4',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 180, 216, 0.2)',
        },
        title: {
          display: true,
          text: 'Time',
          color: '#90e0ef',
          font: {
            weight: 'bold'
          }
        }
      },
    },
  };

  return (
    <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-6 glow-border shadow-glow backdrop-blur-enhanced min-h-[300px] professional-card">
      <div className="flex items-center gap-2 mb-4">
        <FaPlug className="text-blue-400 text-xl" />
        <h3 className="text-white font-bold text-lg">Current Monitor</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-white font-bold">Loading chart...</div>
        </div>
      ) : (
        <Line ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  );
};

const FaultPredictionChart = ({ data }) => {
  const chartRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    const chartInstance = chartRef.current;
    return () => {
      if (chartInstance && chartInstance.chartInstance) {
        chartInstance.chartInstance.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-6 glow-border shadow-glow backdrop-blur-enhanced min-h-[300px] flex items-center justify-center">
        <div className="text-center text-white">
          <FaRobot className="text-4xl text-green-400 mb-4 mx-auto" />
          <p className="text-lg font-bold">No prediction data available</p>
        </div>
      </div>
    );
  }

  // Generate prediction data based on sensor data
  const predictionData = data.map((item, index) => {
    const voltage = item.voltage;
    const current = item.current;
    const vibration = item.vibration;
    
    // Simple fault prediction algorithm
    let probability = 0;
    if (voltage < 220 || voltage > 240) probability += 0.3;
    if (current > 15) probability += 0.4;
    if (vibration > 0.8) probability += 0.3;
    
    return {
      x: new Date(item.timestamp).getTime(),
      y: Math.min(probability, 1.0),
    };
  });

  const chartData = {
    datasets: [
      {
        label: 'Fault Prediction Probability',
        data: predictionData,
        backgroundColor: predictionData.map(point => 
          point.y > 0.7 ? '#ef4444' : point.y > 0.4 ? '#f59e0b' : '#10b981'
        ),
        borderColor: predictionData.map(point => 
          point.y > 0.7 ? '#dc2626' : point.y > 0.4 ? '#d97706' : '#059669'
        ),
        pointRadius: 8,
        pointHoverRadius: 12,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#caf0f8',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
      title: {
        display: true,
        text: 'AI Fault Prediction',
        color: '#90e0ef',
        font: {
          size: 18,
          weight: 'bold'
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          color: '#ade8f4',
          font: {
            weight: 'bold'
          },
          callback: function(value) {
            return (value * 100).toFixed(0) + '%';
          },
        },
        grid: {
          color: 'rgba(144, 224, 239, 0.2)',
        },
        title: {
          display: true,
          text: 'Fault Probability (%)',
          color: '#90e0ef',
          font: {
            weight: 'bold'
          }
        },
      },
      x: {
        type: 'time',
        time: {
          displayFormats: {
            minute: 'HH:mm',
          },
        },
        ticks: {
          color: '#ade8f4',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(144, 224, 239, 0.2)',
        },
        title: {
          display: true,
          text: 'Time',
          color: '#90e0ef',
          font: {
            weight: 'bold'
          }
        },
      },
    },
  };

  return (
    <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-6 glow-border shadow-glow backdrop-blur-enhanced min-h-[300px] professional-card">
      <div className="flex items-center gap-2 mb-4">
        <FaRobot className="text-green-400 text-xl" />
        <h3 className="text-white font-bold text-lg">AI Fault Prediction</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-white font-bold">Loading chart...</div>
        </div>
      ) : (
        <Scatter ref={chartRef} data={chartData} options={options} />
      )}
    </div>
  );
};

export { VoltageChart, CurrentChart, FaultPredictionChart };
