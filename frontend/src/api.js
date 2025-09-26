const API_BASE_URL = 'http://localhost:3000/api';

// Fetch API wrapper with error handling
const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw error;
  }
};

// API endpoints
export const sensorAPI = {
  // Get all sensor data
  getAllSensorData: async () => {
    try {
      return await fetchApi('/sensors');
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return [];
    }
  },

  // Send sensor data (for testing)
  sendSensorData: async (data) => {
    try {
      return await fetchApi('/sensors', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error sending sensor data:', error);
      throw error;
    }
  },

  // Get latest sensor reading
  getLatestReading: async () => {
    try {
      const data = await fetchApi('/sensors');
      return data.length > 0 ? data[data.length - 1] : null;
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      return null;
    }
  },

  // Get sensor data for specific time range
  getSensorDataRange: async (startTime, endTime) => {
    try {
      const allData = await fetchApi('/sensors');
      
      // Filter data by time range
      const filteredData = allData.filter(reading => {
        const readingTime = new Date(reading.timestamp);
        return readingTime >= startTime && readingTime <= endTime;
      });
      
      return filteredData;
    } catch (error) {
      console.error('Error fetching sensor data range:', error);
      return [];
    }
  }
};

// Utility functions
export const utils = {
  // Check if backend is online
  checkServerStatus: async () => {
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // Generate mock data for testing
  generateMockData: () => {
    return {
      voltage: (220 + Math.random() * 20).toFixed(1),
      current: (10 + Math.random() * 10).toFixed(2),
      vibration: (Math.random() * 2).toFixed(3)
    };
  },

  // Determine alert level based on sensor values
  getAlertLevel: (voltage, current, vibration) => {
    const voltageNum = parseFloat(voltage);
    const currentNum = parseFloat(current);
    const vibrationNum = parseFloat(vibration);

    // Critical thresholds
    if (voltageNum > 250 || voltageNum < 200 || currentNum > 20 || vibrationNum > 1.5) {
      return 'CRITICAL';
    }
    
    // Warning thresholds  
    if (voltageNum > 240 || voltageNum < 210 || currentNum > 15 || vibrationNum > 1.0) {
      return 'WARNING';
    }

    return 'NORMAL';
  },

  // Format timestamp for display
  formatTimestamp: (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
};

export default api;
