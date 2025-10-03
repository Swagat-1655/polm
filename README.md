
<h1 align="center">Power Line Monitoring System</h1>
<p align="center">
  AI-Powered Real-time Power Grid Monitoring  
  <br/>
  Built with Modern Web Technologies 🚀
</p>

A **cutting-edge power line monitoring solution** that provides:
- **Real-time Monitoring** of power line status and metrics
- **AI-Powered Analytics** for predictive maintenance
- **Fault Detection & Prevention** using machine learning
- **Interactive 3D Visualization** of power infrastructure

---

## 🌟 Features  
- 🔍 **Real-time Monitoring** – Live visualization of power line metrics  
- 🤖 **AI-Powered Analytics** – Predictive maintenance & fault detection  
- 🚨 **Instant Alerts** – Real-time notifications for anomalies  
- 📊 **Interactive Dashboard** – 3D visualization & data charts  
- 🔄 **IoT Integration** – Seamless sensor data collection  
- 📱 **Responsive Design** – Works on all devices  

---

## 🛠️ Tech Stack  

### 🎨 Frontend – [Frontend Repository](https://github.com/Swagat-1655/polm)  
- **React.js** – Modern UI components  
- **Tailwind CSS** – Responsive styling  
- **Redux Toolkit** – State management  
- **Three.js** – 3D visualization  
- **Chart.js** – Data visualization  
- **Google Maps API** – Location tracking  

### ⚙️ Backend – [Backend Repository](https://github.com/gouravKJ/backend-AIMl)  
- **Node.js + Express.js** – REST API & server  
- **MongoDB** – Database for sensor data  
- **JWT Authentication** – Secure access  
- **RESTful APIs** – Data management  
- **WebSocket** – Real-time updates  

### 🧠 AI/ML Layer  
- **TensorFlow** – Deep learning models  
- **scikit-learn** – Machine learning algorithms  
- **Pandas + NumPy** – Data processing  
- **Flask API** – Model serving  
- **Random Forest** – Predictive analytics  

### 🌐 IoT Layer  
- **Python** – Data collection  
- **MQTT/HTTP** – Communication protocols  
- **Sensor Integration** – Real-time data acquisition  

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account
- Google Maps API key

### 1️⃣ Clone the Repository  https://github.com/Swagat-1655/polm
```bash
git clone 
cd power-line-monitoring
```

### 2️⃣ Install Dependencies  
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3️⃣ Environment Setup  
Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4️⃣ Run the Application  

#### Start Backend
```bash
cd backend
npm start
```

#### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

### 5️⃣ Access the Application  
- Frontend: https://polm.vercel.app/  
- Backend API: https://backend-aiml.onrender.com/  

---

## 📂 Project Structure  
```yaml
power-line-monitoring/
  Frontend (React):
    src/
      components/    # Reusable UI components
      pages/        # Application pages
      store/        # Redux store
      utils/        # Helper functions
      App.jsx       # Main component
      main.jsx      # Entry point
    
  Backend (Node.js):
    controllers/    # Request handlers
    models/         # Database models
    routes/         # API routes
    middleware/     # Authentication & validation
    app.js          # Express app setup
    server.js       # Server entry point
    
  AI_ML/           # Machine learning models
  IoT/             # IoT sensor integration
  docs/            # Documentation
```

## 🚨 Mock Data

If the backend is not available, the application automatically falls back to mock data generation, ensuring the dashboard remains functional for demonstration purposes.

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop (1920x1080+)
- Tablets (768px+)
- Mobile devices (320px+)

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

**Built with ❤️ by Team NEON NEXUS**
