# Shafa Farm Mobile App

A React Native mobile application for farm management and control system. This app connects to your existing backend API and provides mobile access to all farm management features.

## Features

- ✅ **Authentication**: Secure login with JWT token management
- ✅ **Dashboard**: Real-time farm statistics and overview
- ✅ **Goat Management**: Full inventory management with add, edit, delete capabilities
- ✅ **Chicken Management**: Track and manage chicken inventory
- ✅ **Expense Tracking**: Monitor farm expenses and costs
- ✅ **Activity Logging**: Log daily activities and events
- ✅ **Reports**: Generate and view farm reports
- ✅ **Offline Support**: Basic offline functionality with sync queue
- ✅ **Push Notifications**: Get alerts for important farm events

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 12+ (for iOS development)
- Android: Android Studio (for Android development)

## Installation

### Step 1: Install Dependencies

```bash
cd mobile
npm install
```

### Step 2: Configure Backend URL

Edit `src/api.js` and update the `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://YOUR_BACKEND_IP:5000/api';
```

Replace `YOUR_BACKEND_IP` with your backend server's IP address.

### Step 3: Start the App

#### Using Expo Go (Recommended for Development)

```bash
npm start
```

Then:
- **iOS**: Press `i` or scan QR code in Expo Go app
- **Android**: Press `a` or scan QR code in Expo Go app

#### Build for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Both
eas build
```

## Project Structure

```
mobile/
├── src/
│   ├── api.js                          # API service layer
│   ├── context/
│   │   └── AuthContext.js              # Authentication state management
│   ├── navigation/
│   │   └── RootNavigator.js            # Navigation configuration
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.js          # Login screen
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.js      # Dashboard overview
│   │   ├── goats/
│   │   │   ├── GoatInventoryScreen.js  # Goat list
│   │   │   ├── GoatDetailScreen.js     # Goat details
│   │   │   └── CreateGoatScreen.js     # Add new goat
│   │   ├── chickens/
│   │   │   └── ChickenManagementScreen.js
│   │   ├── expenses/
│   │   │   └── ExpensesScreen.js
│   │   ├── activity/
│   │   │   └── ActivityLogScreen.js
│   │   ├── reports/
│   │   │   └── ReportsScreen.js
│   │   ├── profile/
│   │   │   └── ProfileScreen.js
│   │   └── settings/
│   │       └── SettingsScreen.js
│   └── services/
│       └── storageService.js           # Local storage management
├── App.js                              # Main app component
├── app.json                            # Expo configuration
├── babel.config.js                     # Babel configuration
├── package.json                        # Dependencies
└── README.md                           # This file
```

## Usage

### Login

Demo credentials:
- Email: `admin@farm.com`
- Password: `password123`

### Navigation

The app uses bottom tab navigation with the following tabs:

1. **Home** - Dashboard with farm overview
2. **Goats** - Goat inventory management
3. **Chickens** - Chicken management
4. **Expenses** - Expense tracking
5. **Activity** - Activity logging
6. **Reports** - Farm reports
7. **Settings** - App settings

### Goat Management

- **View Goats**: List all goats with quick view of status
- **Add Goat**: Create new goat with basic information
- **View Details**: See comprehensive goat information
- **Edit Goat**: Update goat information
- **Delete Goat**: Remove goat from inventory

## API Integration

The app communicates with your backend through the API service layer (`src/api.js`).

### Available API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

#### Goats
- `GET /goats` - List all goats
- `GET /goats/{id}` - Get goat details
- `POST /goats` - Create new goat
- `PUT /goats/{id}` - Update goat
- `DELETE /goats/{id}` - Delete goat

#### Dashboard
- `GET /dashboard` - Get dashboard statistics

#### Expenses
- `GET /expenses` - List expenses
- `POST /expenses` - Create expense
- `PUT /expenses/{id}` - Update expense
- `DELETE /expenses/{id}` - Delete expense

## Customization

### Changing Colors

Edit the color constants in each screen file:

```javascript
const PRIMARY_COLOR = '#8B7355';  // Brown
const SECONDARY_COLOR = '#D4A574'; // Light brown
```

### Adding New Features

1. Create a new screen in `src/screens/`
2. Add navigation in `src/navigation/RootNavigator.js`
3. Create API methods in `src/api.js` if needed
4. Add state management in `src/context/` if needed

### Offline Support

The app includes basic offline support through:
- Local storage via `AsyncStorage`
- Offline queue in `storageService.js`
- Automatic sync when connection restored

## Troubleshooting

### App Won't Connect to Backend

1. Ensure backend server is running
2. Check if IP address in `src/api.js` is correct
3. Verify firewall allows connections to port 5000
4. On Android, cleartext traffic must be enabled (done in `app.json`)

### Login Issues

1. Verify credentials are correct
2. Check if backend is returning valid JWT token
3. Review browser console for error messages
4. Check `AuthContext.js` error handling

### Network Errors

1. Check internet connection
2. Verify API URL is accessible
3. Check CORS settings on backend
4. Review network tab in Expo Dev Tools

## Performance Optimization

- Uses React hooks for efficient state management
- Implements useFocusEffect for screen refresh
- Lazy loads components via React Navigation
- Uses FlatList for efficient list rendering

## Security

- JWT tokens stored in device secure storage
- Automatic token refresh on expiration
- HTTPS recommended for production
- Sanitized user inputs
- API request timeouts configured

## Building for Production

### iOS

```bash
eas build --platform ios --auto-submit
```

### Android

```bash
eas build --platform android
```

### Generate APK/IPA

```bash
eas build --platform android --local
```

## Device Requirements

- **iOS**: 14.0+
- **Android**: 5.0+ (API Level 21)
- **Minimum RAM**: 2GB
- **Storage**: 100MB+

## Testing

```bash
npm test
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review backend API documentation
3. Check Expo documentation: https://docs.expo.dev/

## License

This project is part of the Shafa Farm ERP System.

## Version

- **Current Version**: 1.0.0
- **Last Updated**: February 2026

---

**Note**: This app requires the Shafa Farm backend server to be running. Ensure the backend is configured and accessible before using the mobile app.
