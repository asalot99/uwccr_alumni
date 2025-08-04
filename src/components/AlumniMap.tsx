import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import apiService from '../services/api';
import { alumniService } from '../services/supabase';
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
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<AlumniLocation | null>(null);
  const [allLocations, setAllLocations] = useState<AlumniLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in demo mode (no auth required)
    const isDemoMode = window.location.pathname.includes('/demo');
    
    if (isDemoMode) {
      // Demo mode: create a sample user location
      console.log('Demo mode: creating sample user location');
      const demoLocation: AlumniLocation = {
        name: 'San Francisco',
        country: 'United States',
        lat: 37.7749,
        lon: -122.4194,
        userId: 'demo-user',
        timestamp: new Date().toISOString(),
        firstName: 'Demo',
        lastName: 'User'
      };
      setUserLocation(demoLocation);
    } else if (isAuthenticated && user?.sub) {
      const userId = user.sub;
      
      // Load user's location
      const savedLocation = localStorage.getItem(`userLocation_${userId}`);
      console.log('Saved location from localStorage:', savedLocation);
      
      if (savedLocation) {
        try {
          const location = JSON.parse(savedLocation);
          console.log('Parsed user location:', location);
          // Enhance with Auth0 user data
          const enhancedLocation = {
            ...location,
            userId: userId,
            firstName: user.given_name || user.name?.split(' ')[0] || 'User',
            lastName: user.family_name || user.name?.split(' ').slice(1).join(' ') || '',
            email: user.email
          };
          console.log('Enhanced user location:', enhancedLocation);
          setUserLocation(enhancedLocation);
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
    console.log('Loading all locations from Supabase...');
    
    try {
      // Fetch real alumni data from Supabase
      const response = await alumniService.getAllAlumni();
      console.log('Supabase response:', response);
      
      if (response.success && response.alumni) {
        const supabaseLocations: AlumniLocation[] = response.alumni.map((alumni: any) => ({
          name: alumni.location_name,
          country: alumni.location_country,
          lat: alumni.location_lat,
          lon: alumni.location_lon,
          userId: alumni.email, // Use email as identifier since we don't have auth0_id
          timestamp: alumni.last_active,
          // Additional data for popup
          firstName: alumni.first_name,
          lastName: alumni.last_name,
          graduationYear: alumni.graduation_year,
          program: alumni.program,
          bio: alumni.bio,
          currentCompany: alumni.current_company,
          jobTitle: alumni.job_title
        }));

        console.log('Loaded alumni from Supabase:', supabaseLocations);

        // Always add current user's location if it exists
        if (userLocation) {
          console.log('Adding user location to map:', userLocation);
          // Use the actual user location data with Auth0 info
          const userLocationFormatted: AlumniLocation = {
            name: userLocation.name,
            country: userLocation.country,
            lat: userLocation.lat,
            lon: userLocation.lon,
            userId: userLocation.userId, // Use actual Auth0 user ID
            timestamp: userLocation.timestamp,
            firstName: userLocation.firstName || 'User',
            lastName: userLocation.lastName || ''
          };
          
          // Remove any existing user location to avoid duplicates (match by email if available)
          const userEmail = user?.email;
          const filteredLocations = userEmail 
            ? supabaseLocations.filter(loc => loc.userId !== userEmail)
            : supabaseLocations;
          const finalLocations = [...filteredLocations, userLocationFormatted];
          console.log('Final locations array:', finalLocations);
          setAllLocations(finalLocations);
        } else {
          console.log('No user location, setting only Supabase locations');
          setAllLocations(supabaseLocations);
        }
      } else {
        console.error('Supabase response error:', response);
        // Try fallback to API
        console.log('Trying fallback to API...');
        const apiResponse = await apiService.getMapData();
        if (apiResponse.success && apiResponse.alumni) {
          const apiLocations: AlumniLocation[] = apiResponse.alumni.map((alumni: any) => ({
            name: alumni.name,
            country: alumni.location.country,
            lat: alumni.location.lat,
            lon: alumni.location.lon,
            userId: alumni.id,
            timestamp: alumni.lastActive,
            firstName: alumni.name.split(' ')[0],
            lastName: alumni.name.split(' ').slice(1).join(' '),
            graduationYear: alumni.graduationYear,
            program: alumni.program,
            bio: alumni.bio,
            currentCompany: alumni.currentCompany,
            jobTitle: alumni.jobTitle
          }));
          setAllLocations(apiLocations);
        } else {
          setAllLocations([]);
        }
      }
    } catch (error) {
      console.error('Error loading alumni data from Supabase:', error);
      
      // Fallback to demo data if API fails
      const demoAlumniLocations: AlumniLocation[] = [
        {
          name: 'London',
          country: 'United Kingdom',
          lat: 51.5074,
          lon: -0.1278,
          userId: 'demo-alumni-1',
          timestamp: new Date().toISOString(),
          firstName: 'Sarah',
          lastName: 'Johnson',
          graduationYear: 2018,
          program: 'International Baccalaureate',
          currentCompany: 'Google',
          jobTitle: 'Software Engineer'
        },
        {
          name: 'Tokyo',
          country: 'Japan',
          lat: 35.6762,
          lon: 139.6503,
          userId: 'demo-alumni-2',
          timestamp: new Date().toISOString(),
          firstName: 'Hiroshi',
          lastName: 'Tanaka',
          graduationYear: 2019,
          program: 'International Baccalaureate',
          currentCompany: 'Sony',
          jobTitle: 'Product Manager'
        },
        {
          name: 'Sydney',
          country: 'Australia',
          lat: -33.8688,
          lon: 151.2093,
          userId: 'demo-alumni-3',
          timestamp: new Date().toISOString(),
          firstName: 'Emma',
          lastName: 'Wilson',
          graduationYear: 2020,
          program: 'International Baccalaureate',
          currentCompany: 'Atlassian',
          jobTitle: 'UX Designer'
        }
      ];

      // Add user location if it exists
      if (userLocation) {
        console.log('Adding user location to demo data:', userLocation);
        const userLocationFormatted: AlumniLocation = {
          name: userLocation.name,
          country: userLocation.country,
          lat: userLocation.lat,
          lon: userLocation.lon,
          userId: userLocation.userId,
          timestamp: userLocation.timestamp,
          firstName: userLocation.firstName || 'User',
          lastName: userLocation.lastName || ''
        };
        
        setAllLocations([...demoAlumniLocations, userLocationFormatted]);
      } else {
        setAllLocations(demoAlumniLocations);
      }
    }
    
    setIsLoading(false);
  };

  const createCustomIcon = (isCurrentUser: boolean) => {
    console.log('Creating icon for current user:', isCurrentUser);
    return new Icon({
      iconUrl: isCurrentUser 
        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNGRjAwMDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+' // Red circle
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMEY2MDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+', // Green circle
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

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
            const isDemoMode = window.location.pathname.includes('/demo');
            const isCurrentUser = isDemoMode 
              ? location.userId === 'demo-user'
              : Boolean(user?.sub && location.userId === user.sub);
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
                    {isCurrentUser && (
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
            if (user?.sub) {
              const userId = user.sub;
              localStorage.removeItem(`userLocation_${userId}`);
              navigate('/location');
            }
          }}
        >
          Update My Location
        </button>
      </div>
    </div>
  );
};

export default AlumniMap;
