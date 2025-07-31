import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAuth0 } from '@auth0/auth0-react';
import 'leaflet/dist/leaflet.css';
import apiService from '../services/api';
import './AlumniMap.css';

interface AlumniLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
  userId: string;
  timestamp: string;
  firstName?: string;
  lastName?: string;
  graduationYear?: number;
  program?: string;
  bio?: string;
  currentCompany?: string;
  jobTitle?: string;
}

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AlumniMap = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userLocation, setUserLocation] = useState<AlumniLocation | null>(null);
  const [allLocations, setAllLocations] = useState<AlumniLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const userId = user.sub;
      
      // Load user's location
      const savedLocation = localStorage.getItem(`userLocation_${userId}`);
      console.log('Saved location from localStorage:', savedLocation);
      
      if (savedLocation) {
        try {
          const location = JSON.parse(savedLocation);
          console.log('Parsed user location:', location);
          console.log('Location structure:', {
            name: location.name,
            country: location.country,
            lat: location.lat,
            lon: location.lon,
            userId: location.userId
          });
          setUserLocation(location);
        } catch (error) {
          console.error('Error parsing user location:', error);
        }
      } else {
        console.log('No saved location found');
      }
    }
  }, [isAuthenticated, user]);

  // Load alumni data when userLocation changes
  useEffect(() => {
    loadAllLocations();
  }, [userLocation]);

  const loadAllLocations = async () => {
    console.log('Loading all locations from API...');
    
    try {
      // Fetch real alumni data from API
      const response = await apiService.getMapData();
      console.log('API response:', response);
      
      if (response.success && response.alumni) {
        const apiLocations: AlumniLocation[] = response.alumni.map((alumni: any) => ({
          name: alumni.name,
          country: alumni.location.country,
          lat: alumni.location.lat,
          lon: alumni.location.lon,
          userId: alumni.id,
          timestamp: alumni.lastActive,
          // Additional data for popup
          firstName: alumni.name.split(' ')[0],
          lastName: alumni.name.split(' ').slice(1).join(' '),
          graduationYear: alumni.graduationYear,
          program: alumni.program,
          bio: alumni.bio,
          currentCompany: alumni.currentCompany,
          jobTitle: alumni.jobTitle
        }));

        // Always add current user's location if it exists
        if (userLocation) {
          console.log('Adding user location to map:', userLocation);
          // Ensure user location has the correct structure
          const userLocationFormatted: AlumniLocation = {
            name: userLocation.name,
            country: userLocation.country,
            lat: userLocation.lat,
            lon: userLocation.lon,
            userId: 'demo-user-id',
            timestamp: userLocation.timestamp,
            firstName: 'Demo',
            lastName: 'User'
          };
          
          // Remove any existing user location to avoid duplicates
          const filteredLocations = apiLocations.filter(loc => loc.userId !== 'demo-user-id');
          const finalLocations = [...filteredLocations, userLocationFormatted];
          console.log('Final locations array:', finalLocations);
          setAllLocations(finalLocations);
        } else {
          console.log('No user location, setting only API locations');
          setAllLocations(apiLocations);
        }
      } else {
        console.error('API response error:', response);
        setAllLocations([]);
      }
    } catch (error) {
      console.error('Error loading alumni data:', error);
      // Fallback to empty array if API fails
      setAllLocations([]);
    }
    
    setIsLoading(false);
  };

  const createCustomIcon = (isCurrentUser: boolean) => {
    console.log('Creating icon for current user:', isCurrentUser);
    return new Icon({
      iconUrl: isCurrentUser 
        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJjLTUuNTIgMC0xMCA0LjQ4LTEwIDEwIDAgNyA5IDE4IDEwIDE4czEwLTExIDEwLTE4YzAtNS41Mi00LjQ4LTEwLTEwLTEweiIgZmlsbD0iI0ZGMDAwMCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=' // Red Google Maps pin
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJjLTUuNTIgMC0xMCA0LjQ4LTEwIDEwIDAgNyA5IDE4IDEwIDE4czEwLTExIDEwLTE4YzAtNS41Mi00LjQ4LTEwLTEwLTEweiIgZmlsbD0iIzAwRjYwMCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=', // Green Google Maps pin
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32]
    });
  };

  // Demo mode - always allow access
  if (window.location.pathname.includes('/map')) {
    // Continue with the component
  }

  if (isLoading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Loading alumni network...</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-wrapper">
        <MapContainer
          center={userLocation ? [userLocation.lat, userLocation.lon] : [20, 0]}
          zoom={userLocation ? 6 : 2}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {allLocations.map((location, index) => {
            const isCurrentUser = location.userId === 'demo-user-id';
            console.log(`Rendering marker ${index}:`, location.name, 'isCurrentUser:', isCurrentUser);
            return (
              <Marker
                key={index}
                position={[location.lat, location.lon]}
                icon={createCustomIcon(isCurrentUser)}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{location.firstName ? `${location.firstName} ${location.lastName}` : location.name}</h3>
                    {location.graduationYear && (
                      <p><strong>Class of {location.graduationYear}</strong></p>
                    )}
                    {location.program && (
                      <p><em>{location.program}</em></p>
                    )}
                    {location.currentCompany && location.jobTitle && (
                      <p>{location.jobTitle} at {location.currentCompany}</p>
                    )}
                    {location.bio && (
                      <p className="bio">{location.bio}</p>
                    )}
                    <p className="location">{location.name}, {location.country}</p>
                    {location.userId === 'demo-user-id' && (
                      <span className="current-user-badge">You</span>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating header */}
      <div className="floating-header">
        <h1>UWCCR Alumni Network</h1>
        <p>Connect with {allLocations.length} UWCCR alumni around the world</p>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-marker current-user"></div>
            <span>Your location</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker other-alumni"></div>
            <span>Other alumni</span>
          </div>
        </div>
      </div>

      {/* Floating controls */}
      <div className="floating-controls">
        <button 
          className="update-location-btn"
          onClick={() => {
            const userId = 'demo-user-id';
            localStorage.removeItem(`userLocation_${userId}`);
            window.location.href = '/location';
          }}
        >
          Update My Location
        </button>
      </div>
    </div>
  );
};

export default AlumniMap; 