import React, { useState, useEffect } from 'react';
import PowerLineAnimation from './PowerLineAnimation';
import { VoltageChart, CurrentChart, FaultPredictionChart } from './Charts';
import MapComponent from './MapComponent';
import { AlertSystem, AIPredictions } from './AlertsAndPredictions';
import ErrorBoundary from './ErrorBoundary';
import { 
  FaBolt, 
  FaPlug, 
  FaChartBar, 
  FaSyncAlt,
  FaChartLine
} from 'react-icons/fa';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [poles, setPoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate mock data since we're operating in demonstration mode
  const fetchSensorData = () => {
    generateMockData();
  };

  // Fetch poles data (mock for now, can be replaced with actual API)
  const fetchPolesData = async () => {
    try {
      // For now, we'll use mock data. Replace with actual API call when available
      // const response = await axios.get('http://localhost:4000/api/poles');
      // setPoles(response.data);
      
      // Mock poles data with comprehensive Kerala coverage - 110 poles across all districts
      // Status is now dynamic based on sensor data conditions
      const latestReading = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
      
      // Determine status based on sensor data - only 1-2 poles show fault during line break
      const getDynamicStatus = (baseStatus, poleId) => {
        if (!latestReading) return baseStatus;
        
        // Check for critical line break condition (high current indicates line break)
        const hasLineBreak = latestReading.current > 15;
        const hasVoltageFault = latestReading.voltage < 210 || latestReading.voltage > 245;
        const hasVibrationFault = latestReading.vibration > 0.8;
        
        // Only specific poles show fault during line break (simulate actual line break location)
        const faultPoles = [3, 16]; // Only Nemom and Kollam City show fault during line break
        
        // Critical fault conditions (red markers)
        if (hasLineBreak || hasVoltageFault || hasVibrationFault) {
          // Only designated poles show fault (red)
          if (faultPoles.includes(poleId)) {
            return 'fault';
          }
        }
        
        // Warning conditions - only 1-2 poles show yellow for minor issues
        const hasMinorCurrent = latestReading.current > 12 && latestReading.current <= 15;
        const hasMinorVoltage = (latestReading.voltage < 220 || latestReading.voltage > 240) && 
                                (latestReading.voltage >= 210 && latestReading.voltage <= 245);
        const hasMinorVibration = latestReading.vibration > 0.5 && latestReading.vibration <= 0.8;
        
        if (hasMinorCurrent || hasMinorVoltage || hasMinorVibration) {
          // Only 2 specific poles show warning (yellow) for minor issues
          const warningPoles = [17, 59]; // Only Paravur and Ernakulam show warning
          if (warningPoles.includes(poleId)) {
            return 'warning';
          }
        }
        
        return 'clear';
      };
      
      const mockPoles = [
        // Thiruvananthapuram District (15 poles)
        { id: 1, lat: 8.5244, lng: 76.9366, status: getDynamicStatus('clear', 1), name: 'TVM Central' },
        { id: 2, lat: 8.3405, lng: 76.8723, status: getDynamicStatus('clear', 2), name: 'Neyyattinkara' },
        { id: 3, lat: 8.4847, lng: 76.9489, status: getDynamicStatus('clear', 3), name: 'Nemom' },
        { id: 4, lat: 8.5066, lng: 76.9572, status: getDynamicStatus('clear', 4), name: 'Pettah' },
        { id: 5, lat: 8.5101, lng: 76.9543, status: getDynamicStatus('clear', 5), name: 'Palayam' },
        { id: 6, lat: 8.4324, lng: 76.9799, status: getDynamicStatus('clear', 6), name: 'Vellayani' },
        { id: 7, lat: 8.6764, lng: 76.8102, status: getDynamicStatus('clear', 7), name: 'Attingal' },
        { id: 8, lat: 8.7389, lng: 76.7164, status: getDynamicStatus('clear', 8), name: 'Varkala' },
        { id: 9, lat: 8.2563, lng: 77.0864, status: getDynamicStatus('clear', 9), name: 'Parassala' },
        { id: 10, lat: 8.1677, lng: 77.0733, status: getDynamicStatus('clear', 10), name: 'Kanyakumari Border' },
        { id: 11, lat: 8.3540, lng: 76.8935, status: getDynamicStatus('clear', 11), name: 'Balaramapuram' },
        { id: 12, lat: 8.3879, lng: 76.9799, status: getDynamicStatus('clear', 12), name: 'Vizhinjam' },
        { id: 13, lat: 8.5661, lng: 76.8832, status: getDynamicStatus('clear', 13), name: 'Kazhakoottam' },
        { id: 14, lat: 8.3616, lng: 77.0643, status: getDynamicStatus('clear', 14), name: 'Poovar' },
        { id: 15, lat: 8.4008, lng: 76.9789, status: getDynamicStatus('clear', 15), name: 'Kovalam' },
        
        // Kollam District (10 poles)
        { id: 16, lat: 8.8932, lng: 76.6141, status: getDynamicStatus('clear', 16), name: 'Kollam City' },
        { id: 17, lat: 8.9673, lng: 76.6451, status: getDynamicStatus('clear', 17), name: 'Paravur' },
        { id: 18, lat: 8.7794, lng: 76.6892, status: getDynamicStatus('clear', 18), name: 'Punalur' },
        { id: 19, lat: 8.8547, lng: 76.6178, status: getDynamicStatus('clear', 19), name: 'Chavara' },
        { id: 20, lat: 8.9157, lng: 76.6342, status: getDynamicStatus('clear', 20), name: 'Anchal' },
        { id: 21, lat: 8.8863, lng: 76.6217, status: getDynamicStatus('clear', 21), name: 'Kottarakkara' },
        { id: 22, lat: 8.9401, lng: 76.6432, status: getDynamicStatus('clear', 22), name: 'Karunagappally' },
        { id: 23, lat: 8.7531, lng: 76.6894, status: getDynamicStatus('clear', 23), name: 'Pathanapuram' },
        { id: 24, lat: 8.8254, lng: 76.6313, status: getDynamicStatus('clear', 24), name: 'Ochira' },
        { id: 25, lat: 8.9298, lng: 76.6547, status: getDynamicStatus('clear', 25), name: 'Sasthamcotta' },
        
        // Pathanamthitta District (8 poles)
        { id: 26, lat: 9.2648, lng: 76.7873, status: 'clear', name: 'Pathanamthitta' },
        { id: 27, lat: 9.3442, lng: 76.8174, status: 'clear', name: 'Thiruvalla' },
        { id: 28, lat: 9.2181, lng: 76.7367, status: 'clear', name: 'Adoor' },
        { id: 29, lat: 9.3894, lng: 76.8201, status: 'clear', name: 'Chengannur' },
        { id: 30, lat: 9.2897, lng: 76.6782, status: 'clear', name: 'Pandalam' },
        { id: 31, lat: 9.4369, lng: 76.8844, status: 'clear', name: 'Aranmula' },
        { id: 32, lat: 9.1567, lng: 76.7234, status: 'clear', name: 'Konni' },
        { id: 33, lat: 9.2234, lng: 76.8567, status: 'clear', name: 'Mallappally' },
        
        // Alappuzha District (9 poles)
        { id: 34, lat: 9.4981, lng: 76.3388, status: 'clear', name: 'Alappuzha' },
        { id: 35, lat: 9.5916, lng: 76.5222, status: 'clear', name: 'Cherthala' },
        { id: 36, lat: 9.4459, lng: 76.4072, status: 'clear', name: 'Haripad' },
        { id: 37, lat: 9.3847, lng: 76.4471, status: 'clear', name: 'Kayamkulam' },
        { id: 38, lat: 9.4971, lng: 76.3411, status: 'clear', name: 'Ambalappuzha' },
        { id: 39, lat: 9.4931, lng: 76.4534, status: 'clear', name: 'Kuttanad' },
        { id: 40, lat: 9.5182, lng: 76.4254, status: 'clear', name: 'Mararikulam' },
        { id: 41, lat: 9.6234, lng: 76.5432, status: 'clear', name: 'Aroor' },
        { id: 42, lat: 9.4123, lng: 76.3987, status: 'clear', name: 'Mavelikara' },
        
        // Kottayam District (8 poles)
        { id: 43, lat: 9.5916, lng: 76.5222, status: 'clear', name: 'Kottayam' },
        { id: 44, lat: 9.6205, lng: 76.6132, status: 'clear', name: 'Changanassery' },
        { id: 45, lat: 9.6847, lng: 76.7351, status: 'clear', name: 'Pala' },
        { id: 46, lat: 9.5234, lng: 76.4987, status: 'clear', name: 'Ettumanoor' },
        { id: 47, lat: 9.7456, lng: 76.6234, status: 'clear', name: 'Mundakayam' },
        { id: 48, lat: 9.5678, lng: 76.5891, status: 'clear', name: 'Vaikom' },
        { id: 49, lat: 9.6789, lng: 76.5432, status: 'clear', name: 'Kumarakom' },
        { id: 50, lat: 9.6543, lng: 76.6789, status: 'clear', name: 'Erattupetta' },
        
        // Idukki District (7 poles)
        { id: 51, lat: 9.8501, lng: 76.9723, status: 'clear', name: 'Idukki Dam' },
        { id: 52, lat: 10.0889, lng: 76.5157, status: 'clear', name: 'Munnar' },
        { id: 53, lat: 9.9234, lng: 76.8567, status: 'clear', name: 'Thodupuzha' },
        { id: 54, lat: 9.7654, lng: 76.7891, status: 'warning', name: 'Kumily' },
        { id: 55, lat: 9.8765, lng: 76.6543, status: 'clear', name: 'Peermade' },
        { id: 56, lat: 9.9876, lng: 76.7234, status: 'clear', name: 'Adimali' },
        { id: 57, lat: 9.8123, lng: 76.9012, status: 'clear', name: 'Nedumkandam' },
        
        // Ernakulam District (12 poles)
        { id: 58, lat: 9.9312, lng: 76.2673, status: 'clear', name: 'Kochi Central' },
        { id: 59, lat: 9.9816, lng: 76.2835, status: 'warning', name: 'Ernakulam' },
        { id: 60, lat: 10.0421, lng: 76.2708, status: 'clear', name: 'Vypin' },
        { id: 61, lat: 9.9647, lng: 76.2376, status: 'clear', name: 'Fort Kochi' },
        { id: 62, lat: 9.9589, lng: 76.2932, status: 'clear', name: 'Marine Drive' },
        { id: 63, lat: 10.0621, lng: 76.3456, status: 'clear', name: 'Aluva' },
        { id: 64, lat: 9.8234, lng: 76.3987, status: 'clear', name: 'Tripunithura' },
        { id: 65, lat: 10.1234, lng: 76.4567, status: 'clear', name: 'Perumbavoor' },
        { id: 66, lat: 9.8765, lng: 76.5432, status: 'clear', name: 'Kothamangalam' },
        { id: 67, lat: 10.0987, lng: 76.2945, status: 'clear', name: 'Kalamassery' },
        { id: 68, lat: 9.9123, lng: 76.4789, status: 'clear', name: 'Muvattupuzha' },
        { id: 69, lat: 10.1567, lng: 76.3421, status: 'clear', name: 'Angamaly' },
        
        // Thrissur District (10 poles)
        { id: 70, lat: 10.5276, lng: 76.2144, status: 'clear', name: 'Thrissur City' },
        { id: 71, lat: 10.4234, lng: 76.1567, status: 'clear', name: 'Guruvayur' },
        { id: 72, lat: 10.5678, lng: 76.3456, status: 'clear', name: 'Irinjalakuda' },
        { id: 73, lat: 10.6789, lng: 76.2789, status: 'clear', name: 'Kodungallur' },
        { id: 74, lat: 10.4987, lng: 76.4321, status: 'clear', name: 'Chalakudy' },
        { id: 75, lat: 10.3456, lng: 76.2134, status: 'clear', name: 'Kunnamkulam' },
        { id: 76, lat: 10.6234, lng: 76.2476, status: 'clear', name: 'Chavakkad' },
        { id: 77, lat: 10.5432, lng: 76.3789, status: 'clear', name: 'Wadakkanchery' },
        { id: 78, lat: 10.4567, lng: 76.3234, status: 'clear', name: 'Ollur' },
        { id: 79, lat: 10.3789, lng: 76.2567, status: 'clear', name: 'Taliparamba Junction' },
        
        // Palakkad District (8 poles)
        { id: 80, lat: 10.7867, lng: 76.6548, status: 'clear', name: 'Palakkad' },
        { id: 81, lat: 10.8234, lng: 76.7891, status: 'clear', name: 'Ottappalam' },
        { id: 82, lat: 10.6789, lng: 76.5432, status: 'clear', name: 'Chittur' },
        { id: 83, lat: 10.9123, lng: 76.6789, status: 'clear', name: 'Shornur' },
        { id: 84, lat: 10.7456, lng: 76.8234, status: 'clear', name: 'Mannarkkad' },
        { id: 85, lat: 10.6543, lng: 76.7654, status: 'clear', name: 'Alathur' },
        { id: 86, lat: 10.8765, lng: 76.5987, status: 'clear', name: 'Pattambi' },
        { id: 87, lat: 10.5987, lng: 76.6234, status: 'clear', name: 'Cherpulassery' },
        
        // Malappuram District (9 poles)
        { id: 88, lat: 11.0748, lng: 76.0781, status: 'clear', name: 'Malappuram' },
        { id: 89, lat: 11.2234, lng: 75.9876, status: 'clear', name: 'Manjeri' },
        { id: 90, lat: 11.1234, lng: 76.1567, status: 'clear', name: 'Perinthalmanna' },
        { id: 91, lat: 11.0567, lng: 76.2345, status: 'clear', name: 'Tirur' },
        { id: 92, lat: 10.9876, lng: 76.1789, status: 'clear', name: 'Kottakkal' },
        { id: 93, lat: 11.1567, lng: 75.8234, status: 'clear', name: 'Nilambur' },
        { id: 94, lat: 11.3456, lng: 76.0987, status: 'warning', name: 'Kondotty' },
        { id: 95, lat: 11.0234, lng: 75.9567, status: 'clear', name: 'Wandoor' },
        { id: 96, lat: 11.2789, lng: 76.0432, status: 'clear', name: 'Areekode' },
        
        // Kozhikode District (8 poles)
        { id: 97, lat: 11.2588, lng: 75.7804, status: 'clear', name: 'Kozhikode City' },
        { id: 98, lat: 11.4234, lng: 75.8567, status: 'clear', name: 'Vadakara' },
        { id: 99, lat: 11.1789, lng: 75.7934, status: 'clear', name: 'Beypore' },
        { id: 100, lat: 11.3567, lng: 75.7891, status: 'clear', name: 'Koyilandy' },
        { id: 101, lat: 11.0987, lng: 75.8432, status: 'clear', name: 'Feroke' },
        { id: 102, lat: 11.2345, lng: 75.7489, status: 'clear', name: 'Ramanattukara' },
        { id: 103, lat: 11.4567, lng: 75.7543, status: 'clear', name: 'Thalassery Road' },
        { id: 104, lat: 11.1876, lng: 75.9123, status: 'clear', name: 'Mukkam' },
        
        // Wayanad District (4 poles)
        { id: 105, lat: 11.6051, lng: 76.0821, status: 'clear', name: 'Kalpetta' },
        { id: 106, lat: 11.7234, lng: 76.1567, status: 'clear', name: 'Sulthan Bathery' },
        { id: 107, lat: 11.5789, lng: 76.2345, status: 'clear', name: 'Mananthavady' },
        { id: 108, lat: 11.6567, lng: 76.0987, status: 'clear', name: 'Vythiri' },
        
        // Kannur District (6 poles)
        { id: 109, lat: 11.8745, lng: 75.3704, status: 'clear', name: 'Kannur City' },
        { id: 110, lat: 12.0234, lng: 75.2567, status: 'clear', name: 'Thalassery' }
      ];
      setPoles(mockPoles);
    } catch (err) {
      console.error('Error fetching poles data:', err);
    }
  };

  // Generate mock data if backend is not available
  const generateMockData = () => {
    const mockData = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - (i * 300000)); // Every 5 minutes
      mockData.unshift({
        id: i + 1,
        voltage: 230 + (Math.random() - 0.5) * 20, // 220-240V range
        current: 10 + Math.random() * 8, // 10-18A range
        vibration: Math.random() * 0.6, // 0-0.6g range
        timestamp: timestamp
      });
    }
    setSensorData(mockData);
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 30000); // Fetch every 30 seconds
    setLoading(false);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPolesData();
  }, [sensorData]);

  const latestReading = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-main-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-green mb-4"></div>
          <p className="text-white text-xl">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-gradient p-4 space-y-6">
      {/* Header */}
      <header className="text-center py-8 md:py-12 relative overflow-hidden bg-black/20 backdrop-blur-sm rounded-2xl mb-6 transition-all duration-500 hover:bg-black/25 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] fade-in-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-700/20 rounded-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            <span className="text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] filter brightness-125">
              PowerLine Monitor
            </span>
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 mx-auto mb-6 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
          <p className="text-lg font-semibold max-w-4xl mx-auto leading-relaxed">
            <span className="text-white text-xl drop-shadow-lg">Driving Safer, Sustainable, and Smarter Power Line Management</span>
          </p>
        </div>
      </header>

      {/* Hero Section with Split Layout */}
      <section className="mb-12 fade-in-section">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Half - Power Line Monitoring Text */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] h-full flex flex-col transition-all duration-500 hover:bg-black/35 hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] professional-card enhanced-backdrop-blur">
              <div className="bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-blue-700/30 rounded-2xl p-6 border border-blue-400/30 transition-all duration-300 hover:border-blue-300/40 h-full flex flex-col">
                <h1 className="text-2xl md:text-3xl font-black mb-6 leading-tight tracking-tight">
                  <span className="text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] filter brightness-110">
                    PowerLine Monitor
                  </span>
                </h1>
                <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 mb-6 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] lg:mx-0"></div>
                
                <div className="flex-1 space-y-8 text-white overflow-y-auto">
                  <div>
                    <p className="text-base md:text-lg leading-relaxed text-white font-medium">
                      Our solution offers a cutting-edge IoT-powered system for real-time monitoring and intelligent fault detection of Low Tension (LT) power lines. Using a network of sensors—including current, voltage, vibration, and tilt detectors—it continuously monitors the condition of electrical lines to detect faults caused by accidents, wear, or weather.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-base md:text-lg leading-relaxed text-white font-medium">
                      The collected data is securely transmitted via MQTT/HTTP protocols to a cloud-based backend, where advanced algorithms analyze it for any signs of malfunction.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-base md:text-lg leading-relaxed text-white font-medium">
                      When a fault is detected, the system automatically isolates the affected section by activating a relay, reducing power outages and preventing further damage. At the same time, instant alerts are sent to utility providers, enabling rapid and efficient maintenance.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-base md:text-lg leading-relaxed text-white font-medium">
                      Our platform uses advanced AI and Machine Learning to predict potential faults by analyzing real-time and historical sensor data. This enables early detection of anomalies, allowing utility providers to take preventive action before failures occur. By turning reactive maintenance into proactive management, we enhance grid reliability, reduce downtime, and improve overall system efficiency.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <FaBolt className="text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" /> 
                      <span className="text-white drop-shadow-[0_0_10px_rgba(72,202,228,0.5)]">Why Choose Us?</span>
                    </h3>
                    <p className="text-base md:text-lg leading-relaxed text-white font-medium">
                      Empower your energy management with smart monitoring, automated fault resolution, and faster service response — making your power infrastructure safer, more reliable, and future-ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Half - Current Flow Visualization */}
            <div className="space-y-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] filter brightness-110 mb-6">
                  Current Flow Visualization
                </h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <PowerLineAnimation status={latestReading?.current > 15 ? 'fault' : latestReading?.voltage < 220 || latestReading?.voltage > 240 ? 'warning' : 'normal'} />
              </div>
              
              {/* Current Status Section */}
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-500 hover:bg-black/35 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                <h3 className="text-xl font-bold text-white mb-4 text-center drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                  Current Status
                </h3>
                
                {latestReading ? (
                  <div className="space-y-4">
                    {/* Real-time Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="glass-morphism glass-morphism-hover card-hover rounded-xl p-6 text-center glow-border pulse-glow-enhanced professional-card">
                        <div className="text-3xl mb-2 float text-yellow-400"><FaBolt /></div>
                        <div className="text-xs text-white mb-2 font-bold text-glow">Voltage</div>
                        <div className="text-2xl font-bold text-white mb-2">
                          {latestReading.voltage.toFixed(1)}V
                        </div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full glow-border ${
                          latestReading.voltage >= 220 && latestReading.voltage <= 240 
                            ? 'text-green-300 bg-green-500/20' : 'text-yellow-300 bg-yellow-500/20'
                        }`}>
                          {latestReading.voltage >= 220 && latestReading.voltage <= 240 ? 'Normal' : 'Warning'}
                        </div>
                      </div>
                      
                      <div className="glass-morphism glass-morphism-hover card-hover rounded-xl p-6 text-center glow-border pulse-glow-enhanced professional-card">
                        <div className="text-3xl mb-2 float text-blue-400"><FaPlug /></div>
                        <div className="text-xs text-white mb-2 font-bold text-glow">Current</div>
                        <div className="text-2xl font-bold text-white mb-2">
                          {latestReading.current.toFixed(1)}A
                        </div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full glow-border ${
                          latestReading.current <= 15 ? 'text-green-300 bg-green-500/20' : 'text-red-300 bg-red-500/20'
                        }`}>
                          {latestReading.current <= 15 ? 'Normal' : 'High'}
                        </div>
                      </div>
                      
                      <div className="glass-morphism glass-morphism-hover card-hover rounded-xl p-6 text-center glow-border pulse-glow-enhanced professional-card">
                        <div className="text-3xl mb-2 float text-green-400"><FaChartBar /></div>
                        <div className="text-xs text-white mb-2 font-bold text-glow">Vibration</div>
                        <div className="text-2xl font-bold text-white mb-2">
                          {latestReading.vibration.toFixed(2)}g
                        </div>
                        <div className={`text-sm font-bold px-3 py-1 rounded-full glow-border ${
                          latestReading.vibration <= 0.8 ? 'text-green-300 bg-green-500/20' : 'text-red-300 bg-red-500/20'
                        }`}>
                          {latestReading.vibration <= 0.8 ? 'Normal' : 'High'}
                        </div>
                      </div>
                    </div>
                    
                    {/* System Health Indicators */}
                    <div className="border-t border-white/30 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-white font-bold text-base">System Health</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
                          (latestReading.voltage >= 220 && latestReading.voltage <= 240 && 
                           latestReading.current <= 15 && latestReading.vibration <= 0.8)
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : (latestReading.current > 15 || latestReading.vibration > 0.8)
                            ? 'bg-red-100 text-red-800 border-red-300'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                          {(latestReading.voltage >= 220 && latestReading.voltage <= 240 && 
                           latestReading.current <= 15 && latestReading.vibration <= 0.8)
                            ? 'OPTIMAL' 
                            : (latestReading.current > 15 || latestReading.vibration > 0.8)
                            ? 'CRITICAL'
                            : 'WARNING'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-base">
                          <span className="text-gray-300 font-semibold">Power Quality:</span>
                          <span className="text-white font-bold">Stable</span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-gray-300 font-semibold">Load Balance:</span>
                          <span className="text-white font-bold">
                            {((latestReading.current / 20) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span className="text-gray-300 font-semibold">Last Update:</span>
                          <span className="text-white font-bold">
                            {new Date(latestReading.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-non-photo-blue mb-2 text-lg font-semibold">No sensor data available</div>
                    <div className="text-sm text-vivid-sky-blue/70">Waiting for connection...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Power line Map Section */}
      <section id="powerline-map" className="mb-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-white text-glow drop-shadow-2xl">
                Power line Map
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-vivid-sky-blue via-non-photo-blue to-light-cyan mx-auto rounded-full"></div>
            <p className="text-gray-200 mt-4 text-lg font-bold max-w-2xl mx-auto">
              Real-time monitoring of distributed power infrastructure with intelligent status tracking
            </p>
          </div>
          <div className="w-full max-w-6xl mx-auto bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <ErrorBoundary fallbackMessage="Failed to load power line map">
              <MapComponent poles={poles} />
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section id="performance-analytics" className="mb-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white text-glow drop-shadow-2xl">
              Performance Analytics
            </span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-vivid-sky-blue via-non-photo-blue to-light-cyan mx-auto rounded-full"></div>
          <p className="text-lg text-gray-200 font-bold max-w-3xl mx-auto mt-4">
            Real-time data visualization and trend analysis for comprehensive power line monitoring
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sensorData.length > 0 ? (
            <>
              <ErrorBoundary fallbackMessage="Failed to load voltage chart">
                <VoltageChart data={sensorData.slice(-10)} />
              </ErrorBoundary>
              <ErrorBoundary fallbackMessage="Failed to load current chart">
                <CurrentChart data={sensorData.slice(-10)} />
              </ErrorBoundary>
              <ErrorBoundary fallbackMessage="Failed to load prediction chart">
                <FaultPredictionChart data={sensorData.slice(-10)} />
              </ErrorBoundary>
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No data available for analysis</div>
              <div className="text-gray-500">Charts will appear once sensor data is received</div>
            </div>
          )}
        </div>
      </section>

      {/* Alerts and Predictions Section */}
      <section id="intelligent-monitoring" className="mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">
            <span className="text-white text-glow drop-shadow-2xl">
              Intelligent Monitoring System
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-vivid-sky-blue via-non-photo-blue to-light-cyan mx-auto mb-4 rounded-full"></div>
          <p className="text-lg text-gray-200 font-bold max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered alert system with predictive analytics for proactive maintenance and fault prevention
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Alerts */}
          <div className="min-h-[600px]">
            <ErrorBoundary fallbackMessage="Failed to load system alerts">
              <AlertSystem sensorData={sensorData} />
            </ErrorBoundary>
          </div>
          
          {/* Right: AI Predictions */}
          <div className="min-h-[600px]">
            <ErrorBoundary fallbackMessage="Failed to load AI predictions">
              <AIPredictions sensorData={sensorData} />
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* Status Summary */}
      <section className="mb-10">
        <div className="glass-morphism glass-morphism-hover rounded-3xl p-8 backdrop-blur-md glow-border shadow-glow text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            <span className="text-white text-glow drop-shadow-2xl">
              System Status Overview
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-vivid-sky-blue via-non-photo-blue to-light-cyan mx-auto mb-6 rounded-full"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-4 glow-border shadow-glow">
              <div className="text-3xl mb-2 float text-blue-400"><FaChartBar /></div>
              <h3 className="text-white font-bold text-base mb-2">Total Sensors</h3>
              <p className="text-2xl font-bold text-white mb-2">{poles.length}</p>
              <p className="text-gray-300 text-sm font-medium">Active monitoring</p>
            </div>
            <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-4 glow-border shadow-glow">
              <div className="text-3xl mb-2 float text-yellow-400"><FaBolt /></div>
              <h3 className="text-white font-bold text-base mb-2">Active Poles</h3>
              <p className="text-2xl font-bold text-white mb-2">{poles.length}</p>
              <p className="text-gray-300 text-sm font-medium">Operational units</p>
            </div>
            <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-4 glow-border shadow-glow">
              <div className="text-3xl mb-2 float text-green-400"><FaChartLine /></div>
              <h3 className="text-white font-bold text-base mb-2">Data Points</h3>
              <p className="text-2xl font-bold text-white mb-2">{sensorData.length}</p>
              <p className="text-gray-300 text-sm font-medium">Collected metrics</p>
            </div>
            <div className="glass-morphism glass-morphism-hover card-hover rounded-2xl p-4 glow-border shadow-glow">
              <div className="text-3xl mb-2 float text-blue-400"><FaSyncAlt /></div>
              <h3 className="text-white font-bold text-base mb-2">Last Update</h3>
              <p className="text-base font-bold text-white mb-2">
                {latestReading ? new Date(latestReading.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
              <p className="text-gray-300 text-sm font-medium">System sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16">
        <div className="bg-gradient-to-r from-federal-blue via-marian-blue to-honolulu-blue py-12 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                <span className="text-white text-glow drop-shadow-2xl">
                  PowerLine Monitor
                </span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-vivid-sky-blue via-non-photo-blue to-light-cyan mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-200 text-lg font-medium mb-6 max-w-3xl mx-auto">
              Advanced real-time monitoring powered by IoT sensors and artificial intelligence
            </p>
            <div className="border-t border-white/30 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-white">
                  <p className="text-lg font-bold">Made by Team NEON NEXUS</p>
                  <p className="text-gray-300 text-sm mt-1">Delivering intelligent infrastructure solutions</p>
                </div>
                <div className="text-white text-right">
                  <p className="font-semibold">&copy; 2025 All rights reserved.</p>
                  <p className="text-gray-300 text-sm mt-1">Powered by AI & IoT Technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
