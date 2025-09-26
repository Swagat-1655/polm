import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet with error handling
try {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
} catch (error) {
  console.warn('Leaflet icon initialization failed:', error);
}

const MapComponent = ({ poles = [] }) => {
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and check for map readiness
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Error handler for map-related errors
  const handleMapError = (error) => {
    console.error('Map error:', error);
    setMapError(error.message || 'Map failed to load');
  };
  // Use poles data passed from Dashboard, no default fallback needed since Dashboard provides comprehensive data
  const poleData = poles.length > 0 ? poles : [];

  const getMarkerColor = (status) => {
    switch (status) {
      case 'fault':
        return '#ef4444'; // Red
      case 'warning':
        return '#f59e0b'; // Yellow
      case 'clear':
        return '#10b981'; // Green to match index
      default:
        return '#10b981'; // Green
    }
  };

  // Create custom marker icons for different statuses
  const createCustomIcon = (status) => {
    const color = getMarkerColor(status);
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid #FFFFFF;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: rgba(255,255,255,0.8);
          border-radius: 50%;
        "></div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  };

  // Create icons dynamically for each pole to ensure status updates
  const createIconForPole = (status) => {
    return createCustomIcon(status);
  };

  // Satellite imagery tile layer URL
  const satelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const attribution = '&copy; <a href="https://www.esri.com/">Esri</a>, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community';

  const mapCenter = [9.9312, 76.2673]; // Kerala, India center (Kochi)
  const mapZoom = 8;

  // Function to get wire color based on connected poles' status
  const getWireColor = (pole1, pole2) => {
    // If either pole has fault, wire is red
    if (pole1.status === 'fault' || pole2.status === 'fault') {
      return '#ef4444'; // Red
    }
    // If either pole has warning, wire is yellow
    if (pole1.status === 'warning' || pole2.status === 'warning') {
      return '#f59e0b'; // Yellow
    }
    // Default is green for clear status
    return '#10b981'; // Green
  };

  // Create connections between adjacent poles only (realistic power grid)
  const createConnections = () => {
    const connections = [];
    
    // Define adjacent pole connections based on geographical proximity and logical power grid layout
    // This creates a realistic power transmission network with:
    // - Main transmission corridors along major routes
    // - Strategic cross-connections for grid stability and redundancy
    // - Logical connections between neighboring cities/districts
    // - District-wise connections for comprehensive 110-pole network
    
    const adjacentConnections = [
      // Thiruvananthapuram District Internal Connections (1-15)
      [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
      [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 1],
      // Strategic internal cross-connections
      [1, 6], [3, 8], [5, 12], [7, 14],
      
      // Kollam District Internal Connections (16-25)
      [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23],
      [23, 24], [24, 25], [25, 16],
      // Cross-connections
      [16, 20], [18, 22], [19, 24],
      
      // Pathanamthitta District Internal Connections (26-33)
      [26, 27], [27, 28], [28, 29], [29, 30], [30, 31], [31, 32], [32, 33], [33, 26],
      // Cross-connections
      [26, 30], [28, 32],
      
      // Alappuzha District Internal Connections (34-42)
      [34, 35], [35, 36], [36, 37], [37, 38], [38, 39], [39, 40], [40, 41], [41, 42], [42, 34],
      // Cross-connections
      [34, 38], [36, 40], [37, 41],
      
      // Kottayam District Internal Connections (43-50)
      [43, 44], [44, 45], [45, 46], [46, 47], [47, 48], [48, 49], [49, 50], [50, 43],
      // Cross-connections
      [43, 47], [45, 49],
      
      // Idukki District Internal Connections (51-57)
      [51, 52], [52, 53], [53, 54], [54, 55], [55, 56], [56, 57], [57, 51],
      // Cross-connections
      [51, 55], [53, 56],
      
      // Ernakulam District Internal Connections (58-69)
      [58, 59], [59, 60], [60, 61], [61, 62], [62, 63], [63, 64], [64, 65],
      [65, 66], [66, 67], [67, 68], [68, 69], [69, 58],
      // Cross-connections for metro area
      [58, 63], [59, 66], [60, 67], [61, 68], [62, 69], [64, 69],
      
      // Thrissur District Internal Connections (70-79)
      [70, 71], [71, 72], [72, 73], [73, 74], [74, 75], [75, 76], [76, 77],
      [77, 78], [78, 79], [79, 70],
      // Cross-connections
      [70, 74], [71, 77], [72, 78], [73, 79],
      
      // Palakkad District Internal Connections (80-87)
      [80, 81], [81, 82], [82, 83], [83, 84], [84, 85], [85, 86], [86, 87], [87, 80],
      // Cross-connections
      [80, 84], [82, 86], [81, 85],
      
      // Malappuram District Internal Connections (88-96)
      [88, 89], [89, 90], [90, 91], [91, 92], [92, 93], [93, 94], [94, 95], [95, 96], [96, 88],
      // Cross-connections
      [88, 92], [89, 95], [90, 94], [91, 96],
      
      // Kozhikode District Internal Connections (97-104)
      [97, 98], [98, 99], [99, 100], [100, 101], [101, 102], [102, 103], [103, 104], [104, 97],
      // Cross-connections
      [97, 101], [98, 102], [99, 103], [100, 104],
      
      // Wayanad District Internal Connections (105-108)
      [105, 106], [106, 107], [107, 108], [108, 105],
      // Cross-connection
      [105, 107], [106, 108],
      
      // Kannur District Internal Connections (109-110)
      [109, 110],
      
      // INTER-DISTRICT CONNECTIONS (Main Transmission Lines)
      // South to Central Kerala
      [15, 16],  // TVM to Kollam (southern corridor)
      [8, 18],   // TVM-Varkala to Kollam-Punalur (inland route)
      [25, 26],  // Kollam to Pathanamthitta
      [22, 33],  // Kollam-Karunagappally to Pathanamthitta-Mallappally
      [27, 34],  // Pathanamthitta-Thiruvalla to Alappuzha
      [29, 41],  // Pathanamthitta-Chengannur to Alappuzha-Aroor
      
      // Central Kerala Interconnections
      [42, 43],  // Alappuzha to Kottayam
      [35, 48],  // Alappuzha-Cherthala to Kottayam-Vaikom
      [44, 58],  // Kottayam-Changanassery to Ernakulam-Kochi Central
      [50, 53],  // Kottayam-Erattupetta to Idukki-Thodupuzha
      [45, 55],  // Kottayam-Pala to Idukki-Peermade
      [43, 64],  // Kottayam to Ernakulam-Tripunithura
      
      // Ernakulam to Northern Districts
      [63, 70],  // Ernakulam-Aluva to Thrissur City (NH47 corridor)
      [69, 71],  // Ernakulam-Angamaly to Thrissur-Guruvayur
      [65, 74],  // Ernakulam-Perumbavoor to Thrissur-Chalakudy
      [68, 72],  // Ernakulam-Muvattupuzha to Thrissur-Irinjalakuda
      
      // Thrissur to Palakkad & Malappuram
      [75, 80],  // Thrissur-Kunnamkulam to Palakkad
      [78, 82],  // Thrissur-Ollur to Palakkad-Chittur
      [77, 87],  // Thrissur-Wadakkanchery to Palakkad-Cherpulassery
      [79, 83],  // Thrissur-Taliparamba Junction to Palakkad-Shornur
      [70, 88],  // Thrissur City to Malappuram
      [72, 92],  // Thrissur-Irinjalakuda to Malappuram-Kottakkal
      
      // Palakkad to Malappuram & Eastern connections
      [83, 88],  // Palakkad-Shornur to Malappuram
      [84, 93],  // Palakkad-Mannarkkad to Malappuram-Nilambur
      [80, 90],  // Palakkad to Malappuram-Perinthalmanna
      [52, 84],  // Idukki-Munnar to Palakkad-Mannarkkad (mountain route)
      [56, 87],  // Idukki-Adimali to Palakkad-Cherpulassery
      
      // Northern Kerala Network
      [96, 97],  // Malappuram-Areekode to Kozhikode City
      [91, 99],  // Malappuram-Tirur to Kozhikode-Beypore
      [94, 100], // Malappuram-Kondotty to Kozhikode-Koyilandy
      [89, 104], // Malappuram-Manjeri to Kozhikode-Mukkam
      [88, 101], // Malappuram to Kozhikode-Feroke
      
      // Kozhikode to Wayanad & Kannur
      [98, 109], // Kozhikode-Vadakara to Kannur City (coastal route)
      [103, 110], // Kozhikode-Thalassery Road to Kannur-Thalassery
      [104, 105], // Kozhikode-Mukkam to Wayanad-Kalpetta (ghat route)
      [93, 106], // Malappuram-Nilambur to Wayanad-Sulthan Bathery
      [95, 107], // Malappuram-Wandoor to Wayanad-Mananthavady
      
      // Final Northern Connections
      [108, 109], // Wayanad-Vythiri to Kannur City
      [105, 110], // Wayanad-Kalpetta to Kannur-Thalassery (mountain route)
      
      // Strategic Backup Lines for Grid Stability
      [1, 58],   // TVM Central to Kochi Central (express line)
      [16, 43],  // Kollam to Kottayam (bypass line)
      [70, 97],  // Thrissur to Kozhikode (central-north express)
      [52, 105], // Munnar to Kalpetta (hill station link)
      [34, 58],  // Alappuzha to Kochi (backwater express)
      [80, 97],  // Palakkad to Kozhikode (inland route)
      [26, 51],  // Pathanamthitta to Idukki Dam (hydro connection)
    ];
    
    adjacentConnections.forEach(([id1, id2]) => {
      const pole1 = poleData.find(pole => pole.id === id1);
      const pole2 = poleData.find(pole => pole.id === id2);
      
      if (pole1 && pole2) {
        // Calculate distance for reference
        const distance = Math.sqrt(
          Math.pow(pole1.lat - pole2.lat, 2) + 
          Math.pow(pole1.lng - pole2.lng, 2)
        );
        
        connections.push({
          positions: [
            [pole1.lat, pole1.lng],
            [pole2.lat, pole2.lng]
          ],
          color: getWireColor(pole1, pole2),
          key: `${pole1.id}-${pole2.id}`,
          distance: distance
        });
      }
    });
    
    // Sort by distance for consistent rendering order
    return connections.sort((a, b) => a.distance - b.distance);
  };

  const connections = createConnections();

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (mapError) {
    return (
      <div className="w-full h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center bg-black/20 rounded-xl border border-red-500/30">
        <div className="text-white text-center p-6">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Map Error</h3>
          <p className="text-gray-300 mb-4">{mapError}</p>
          <button 
            onClick={() => {
              setMapError(null);
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 1000);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] md:h-[600px] overflow-hidden">
      <div className="p-6 mb-4">
        <h3 className="text-white text-xl font-bold mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">Power Line Status Map</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-400 mr-2 border border-green-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
            <span className="text-white font-bold drop-shadow-lg">Clear</span>
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2 border border-yellow-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
            <span className="text-white font-bold drop-shadow-lg">Warning</span>
          </span>
          <span className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-400 mr-2 border border-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
            <span className="text-white font-bold drop-shadow-lg">Fault</span>
          </span>
        </div>
      </div>
      <div className="w-full h-[420px] md:h-[520px] overflow-hidden rounded-xl">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          whenCreated={(map) => {
            map.on('error', handleMapError);
          }}
        >
          <TileLayer
            url={satelliteUrl}
            attribution={attribution}
          />
          
          {/* Power line connections */}
          {connections.map((connection) => (
            <React.Fragment key={connection.key}>
              {/* Shadow line for better visibility */}
              <Polyline
                positions={connection.positions}
                pathOptions={{
                  color: '#000000',
                  weight: 6,
                  opacity: 0.3,
                  dashArray: '8, 4',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Main colored line */}
              <Polyline
                positions={connection.positions}
                pathOptions={{
                  color: connection.color,
                  weight: 4,
                  opacity: 0.8,
                  dashArray: '8, 4',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
            </React.Fragment>
          ))}
          
          {/* Pole markers */}
          {poleData.map((pole) => (
            <Marker 
              key={`${pole.id}-${pole.status}`} 
              position={[pole.lat, pole.lng]} 
              icon={createIconForPole(pole.status)}
            >
              <Popup>
                <div className="text-gray-800 p-2">
                  <h3 className="font-bold text-lg mb-2">{pole.name}</h3>
                  <p className="mb-1">
                    <span className="font-semibold">Status:</span>{' '}
                    <span 
                      className={`font-bold ${
                        pole.status === 'fault' ? 'text-red-600' :
                        pole.status === 'warning' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}
                    >
                      {pole.status.toUpperCase()}
                    </span>
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Lat:</span> {pole.lat.toFixed(4)}
                  </p>
                  <p>
                    <span className="font-semibold">Lng:</span> {pole.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
