# Stock Market Monitor App

A mobile application developed with React Native and Expo to monitor stock market shares.

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the application:
   ```bash
   npx expo start
   ```
3. Run on specific platforms:
   ```bash
   # iOS
   npm run ios
   # Android
   npm run android
   # Web
   npm run web
   ```
4. Run tests:
   ```bash
   npm test
   ```

## Implemented Requirements

### Core Requirements ✅

- Stock list with basic styles
- Display of name, current price, and daily percentage change
- Intuitive and responsive user interface

### Auxiliary Requirements ✅

- Sorting by name, price, and percentage change
- Filtering by name/symbol
- Detailed stock view
- Offline support using AsyncStorage
- Smooth transitions and animations

## Technical Decisions and Trade-offs

#### Architecture

- **Expo Router:** Used for navigation and project structure
- **TypeScript:** Implemented for type safety and better maintainability
- **Atomic Design:** Reusable components like ThemedText and ThemedView

#### State and Data

- **Local Storage:** Implemented with AsyncStorage for offline support
- **Dummy Data:** Using the provided dummy_stock_data.json file

#### UI/UX

- **Animations:** Implemented with react-native-reanimated for smooth transitions
- **Theme:** Light/dark theme system with custom hooks
- **Components:** Modular and reusable design

#### Testing

- **Jest:** Main framework for testing
- **React Native Testing Library:** For component tests

### Trade-offs

1. **Performance vs User Experience**

   - Use of animations may impact performance
   - Prioritized user experience

2. **Local Storage vs Real-Time**

   - Data stored locally for offline support
   - No real-time updates

3. **Simplicity vs Functionality**
   - Focus on core functionalities first
   - Simple but effective UI

### Project Structure

```bash
app/
├── components/      # Reusable components
├── hooks/           # Custom hooks
├── services/        # Services (storage, etc)
├── types/           # Type definitions
└── index.tsx        # Main entry point
```

## Future Improvements

1. Functionality

   - Real-time data updates
   - More financial indicators
   - Historical price charts

2. Technical

   - More sophisticated caching
   - Testing improvements
   - Performance optimizations

3. UX

   - More customization options
   - Push notifications
   - Native widgets

## Notes

- The dummy_stock_data.json file is used to simulate data
- The application is optimized for iOS and Android
- Support for light/dark mode
