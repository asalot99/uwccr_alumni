import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './LocationInput.css';

interface LocationSuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

interface DeviceLocation {
  lat: number;
  lon: number;
  accuracy?: number;
}

const LocationInput = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user has already set location
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const userId = user.sub;
      const savedLocation = localStorage.getItem(`userLocation_${userId}`);
      if (savedLocation) {
        navigate('/map');
      }
    }
  }, [navigate, isAuthenticated, user]);

  const requestDeviceLocation = () => {
    setIsGettingLocation(true);
    setShowLocationPrompt(false);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setDeviceLocation({ lat: latitude, lon: longitude, accuracy });
          setLocationPermission('granted');
          setIsGettingLocation(false);
          
          // Automatically search for the location name
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          setIsGettingLocation(false);
          setShowLocationPrompt(false);
          alert('Unable to get your location. Please enter your city manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationPermission('denied');
      setIsGettingLocation(false);
      alert('Geolocation is not supported by this browser. Please enter your city manually.');
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.display_name) {
        // Extract only the city name from the address
        let cityName = '';
        const country = data.address?.country || '';
        
        // Try to get the city from address details
        if (data.address) {
          // Priority order for city name extraction
          cityName = data.address.city || 
                    data.address.town || 
                    data.address.village || 
                    data.address.municipality ||
                    data.address.county ||
                    data.address.state ||
                    data.display_name.split(',')[0]; // Fallback to first part
        } else {
          // Fallback: take only the first part before any comma
          cityName = data.display_name.split(',')[0];
        }
        
        const suggestedLocation: LocationSuggestion = {
          name: cityName,
          country: country,
          lat: lat,
          lon: lon
        };
        
        setSelectedLocation(suggestedLocation);
        setLocation(cityName);
        setShowLocationPrompt(false);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setShowLocationPrompt(false);
    }
  };

  const acceptDeviceLocation = () => {
    if (deviceLocation && selectedLocation) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const declineDeviceLocation = () => {
    setShowLocationPrompt(false);
    setDeviceLocation(null);
    setSelectedLocation(null);
    setLocation('');
  };

  // Handle clicks outside suggestions and cleanup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      // Using OpenStreetMap Nominatim API with city-level search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&featuretype=city&countrycodes=`
      );
      const data = await response.json();
      
      const formattedSuggestions: LocationSuggestion[] = data.map((item: any) => {
        // Extract only the city name from the result
        let cityName = '';
        const country = item.address?.country || '';
        
        if (item.address) {
          // Priority order for city name extraction
          cityName = item.address.city || 
                    item.address.town || 
                    item.address.village || 
                    item.address.municipality ||
                    item.address.county ||
                    item.address.state ||
                    item.display_name.split(',')[0]; // Fallback to first part
        } else {
          // Fallback: take only the first part before any comma
          cityName = item.display_name.split(',')[0];
        }
        
        return {
          name: cityName,
          country: country,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        };
      });
      
      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fallback to a simple search if API fails
      setSuggestions([
        { name: query, country: 'Search result', lat: 0, lon: 0 }
      ]);
      setShowSuggestions(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    setSelectedLocation(null);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value === '') {
      setSuggestions([]);
      setShowSuggestions(false);
    } else {
      // Add a small delay to avoid too many API calls
      searchTimeoutRef.current = setTimeout(() => {
        searchLocations(value);
      }, 300);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.name);
    setSelectedLocation(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      alert('Please select a location from the suggestions');
      return;
    }

    // Save user location
    const userId = user?.sub || 'demo-user-id';
    const userLocation = {
      ...selectedLocation,
      userId: userId,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(`userLocation_${userId}`, JSON.stringify(userLocation));
    
    // In a real app, you'd save this to your backend
    // await saveUserLocation(userLocation);
    
    navigate('/map');
  };

  // Demo mode - always allow access
  if (window.location.pathname.includes('/location')) {
    // Continue with the component
  }

  return (
    <div className="location-container">
      {/* Location Permission Prompt */}
      {showLocationPrompt && deviceLocation && (
        <div className="location-prompt-overlay">
          <div className="location-prompt-card">
            <div className="location-prompt-header">
              <h2>📍 Share Your City?</h2>
              <p>We found your current city: <strong>{selectedLocation?.name}, {selectedLocation?.country}</strong></p>
              <p className="privacy-note">Only your city name will be shared with other alumni</p>
              {deviceLocation.accuracy && (
                <p className="accuracy-info">Location accuracy: ±{Math.round(deviceLocation.accuracy)} meters</p>
              )}
            </div>
            
            <div className="location-prompt-actions">
              <button 
                onClick={acceptDeviceLocation}
                className="location-prompt-btn primary"
              >
                ✅ Use This Location
              </button>
              <button 
                onClick={declineDeviceLocation}
                className="location-prompt-btn secondary"
              >
                ❌ Enter Manually
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="location-card">
        <div className="location-header">
          <h1>Welcome, {user?.name || 'UWCCR Alumni'}!</h1>
          <p>Help us connect you with fellow UWCCR alumni by sharing your location</p>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-group">
            <label htmlFor="location">Your Location</label>
            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                id="location"
                value={location}
                onChange={handleLocationChange}
                placeholder="City"
                className={location === '' ? 'placeholder-text' : ''}
                required
              />
              {isLoading && <div className="loading-spinner"></div>}
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} className="suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="suggestion-name">{suggestion.name}</div>
                    <div className="suggestion-country">{suggestion.country}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Location Detection Button */}
          <div className="location-actions">
            <button 
              type="button" 
              onClick={requestDeviceLocation}
              className="location-detect-btn"
              disabled={isGettingLocation}
            >
              {isGettingLocation ? '🔄 Getting Location...' : '📍 Use My Current Location'}
            </button>
          </div>

          <button type="submit" className="submit-button" disabled={!selectedLocation}>
            Continue to Map
          </button>
        </form>

        <div className="location-footer">
          <p>💡 Tip: Allow location access to automatically detect your city!</p>
          <p className="privacy-info">🔒 Only your city name will be shared with other alumni</p>
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
