# Alumni Network Map

A modern web application that allows alumni to connect through an interactive global map. Users can log in, set their location, and view other alumni around the world.

## Features

- 🔐 **Authentication**: Email/password login and SSO support via Auth0
- 📍 **Location Input**: Autocomplete city search with real-time suggestions
- 🗺️ **Interactive Map**: Global map showing all alumni locations
- 🎯 **Visual Indicators**: Red markers for current user, green for other alumni
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Modern Tech Stack**: React, TypeScript, Vite, and Leaflet

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Auth0 account (for authentication)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Auth0:**
   - Create an Auth0 account at [auth0.com](https://auth0.com)
   - Create a new application (Single Page Application)
   - Copy your Domain and Client ID

3. **Configure Auth0 in the app:**
   - Open `src/App.tsx`
   - Replace `your-auth0-domain.auth0.com` with your actual Auth0 domain
   - Replace `your-auth0-client-id` with your actual Auth0 client ID

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## Usage Flow

1. **Login**: Users can sign in with email/password or SSO
2. **Location Setup**: First-time users enter their city with autocomplete
3. **Map View**: Interactive globe showing all alumni locations
4. **Connect**: Click on markers to see alumni details

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Authentication**: Auth0
- **Maps**: Leaflet + React-Leaflet
- **Styling**: CSS3 with modern design patterns
- **Location API**: OpenStreetMap Nominatim

## Project Structure

```
src/
├── components/
│   ├── Login.tsx          # Authentication component
│   ├── LocationInput.tsx  # Location selection with autocomplete
│   ├── AlumniMap.tsx      # Interactive map component
│   └── *.css              # Component-specific styles
├── App.tsx                # Main app with routing
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## Customization

### Adding More Alumni
Edit the `loadAllLocations` function in `AlumniMap.tsx` to add more mock data or connect to your backend API.

### Styling
- Component styles are in their respective `.css` files
- Global styles are in `src/App.css`
- Color scheme uses a purple gradient theme

### Authentication
The app uses Auth0 for authentication. You can customize the login experience by modifying the `Login.tsx` component.

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload the `dist` folder to an S3 bucket

## Environment Variables

For production, you'll want to set these environment variables:

```env
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own alumni network!

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
