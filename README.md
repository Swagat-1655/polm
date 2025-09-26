# Power Line Monitoring Dashboard

A comprehensive real-time power line monitoring system built with React, Three.js, Chart.js, and Google Maps integration. Features AI-powered predictions and stunning gradient-themed visualizations.

## 🚀 Features

- **Real-time 3D Visualization**: Interactive current flow animation using Three.js
- **Live Sensor Monitoring**: Voltage, current, and vibration sensor readings
- **Interactive Maps**: Google Maps integration with color-coded status pins
- **Advanced Analytics**: Real-time charts for voltage, current, and fault predictions
- **AI Predictions**: Machine learning-powered fault prediction and maintenance recommendations
- **Alert System**: Real-time alerts based on sensor thresholds
- **Responsive Design**: Beautiful gradient theme with deep blue, emerald green, and white

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Charts**: Chart.js, react-chartjs-2
- **Maps**: Google Maps API
- **HTTP Client**: Axios
- **Backend**: Node.js, Express (included)

## 📁 Project Structure

```
src/
├── components/
│   ├── CurrentAnimation.js      # 3D current flow visualization
│   ├── Charts.js               # Voltage, current, and prediction charts
│   ├── MapComponent.js         # Google Maps with status pins
│   ├── SensorReadings.js       # Live sensor data display
│   ├── AlertsAndPredictions.js # Alert system and AI predictions
│   └── Dashboard.js            # Main dashboard component
├── App.js                      # Main app component
├── index.js                    # React entry point
└── index.css                   # Tailwind and custom styles
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Maps API key (optional)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Google Maps** (Optional):
   - Get a Google Maps API key from Google Cloud Console
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `public/index.html`

3. **Start the backend server**:
   ```bash
   # In a separate terminal, navigate to your backend folder
   cd backend
   node server.js
   ```

4. **Start the React development server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🔧 Backend Integration

The dashboard integrates with your Node.js backend running on port 4000. The backend should provide:

### API Endpoints

- `GET /api/sensors` - Retrieve all sensor data
- `POST /api/sensors` - Add new sensor data
- `GET /api/poles` - Get power pole locations and status (optional)

### Data Format

**Sensor Data**:
```json
{
  "id": 1,
  "voltage": 230.5,
  "current": 12.3,
  "vibration": 0.2,
  "timestamp": "2025-01-11T07:00:00.000Z"
}
```

**Pole Data**:
```json
{
  "id": 1,
  "lat": 40.7128,
  "lng": -74.0060,
  "status": "clear", // "clear", "warning", "fault"
  "name": "Pole 1 - Location"
}
```

## 🎨 Customization

### Color Theme
The app uses a beautiful gradient theme that can be customized in `tailwind.config.js`:

- **Deep Blue**: `#0F172A`
- **Emerald Green**: `#059669`
- **White**: `#FFFFFF`

### Sensor Thresholds
Modify alert thresholds in `AlertsAndPredictions.js`:

```javascript
// Voltage thresholds
if (voltage < 210 || voltage > 245) // Critical
if (voltage < 220 || voltage > 240) // Warning

// Current thresholds  
if (current > 16) // Critical
if (current > 12) // Warning

// Vibration thresholds
if (vibration > 0.8) // Critical
if (vibration > 0.5) // Warning
```

## 🔍 Features Overview

### 1. Hero Section
- 3D animated current flow visualization
- Real-time current value display
- Interactive 3D scene with orbit controls

### 2. Sensor Monitoring
- Live sensor cards with status indicators
- Google Maps with color-coded status pins
- Real-time data updates every 30 seconds

### 3. Analytics Dashboard
- Voltage vs Time chart
- Current vs Time chart  
- Fault Prediction Probability scatter plot

### 4. Alert System
- Real-time alerts based on sensor thresholds
- Color-coded severity levels (Critical, Warning, Info)
- Alert history with timestamps

### 5. AI Predictions
- Line break probability calculation
- Maintenance priority recommendations
- Estimated time to failure
- Recommended actions list
- AI confidence level indicator

## 🚨 Mock Data

If the backend is not available, the application automatically falls back to mock data generation, ensuring the dashboard remains functional for demonstration purposes.

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop (1920x1080+)
- Tablets (768px+)
- Mobile devices (320px+)

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Performance Tips

- Charts update only with the last 10 data points for optimal performance
- 3D animations use requestAnimationFrame for smooth rendering
- Components are optimized with React.memo where appropriate

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support or questions, please create an issue in the repository.

---

**Built with ❤️ using React, Three.js, and modern web technologies**
