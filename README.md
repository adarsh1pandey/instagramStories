# Instagram Stories Feature

A simplified Instagram Stories implementation built with React, TypeScript, and Tailwind CSS. This application provides a mobile-first experience for viewing and navigating through user stories.

## 🚀 Live Demo

**Deployment Link**: [https://instagram-stories-bchf.vercel.app/](https://instagram-stories-bchf.vercel.app/)

## ✨ Features

- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interactions
- **Story Navigation**:
  - Click/tap left/right sides to navigate between stories
  - Touch swipe gestures for navigation
  - Auto-advance after 5 seconds
- **Interactive Controls**:
  - Pause/Play functionality
  - Progress indicators for each story
  - Close button to exit viewer
- **Visual Feedback**:
  - Loading states for images
  - Error handling with retry functionality
  - Smooth transitions and animations
- **Responsive Design**: Works seamlessly on various mobile screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Jest & React Testing Library** for testing
- **Create React App** for build tooling

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/instagram-stories.git
   cd instagram-stories
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests specifically
npm run test:e2e
```

### Building for Production

```bash
npm run build
```

### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 🎯 Design Decisions & Optimizations

### Performance Optimizations

1. **Lazy Loading**: Images are loaded lazily to improve initial load time
2. **Efficient Re-renders**: Using React.memo and useCallback to prevent unnecessary re-renders
3. **Optimized State Management**: Minimal state updates with proper dependency arrays
4. **Image Preloading**: Next story images are preloaded for smooth transitions

### Scalability Considerations

1. **Component Architecture**: Modular components that can be easily extended
2. **Custom Hooks**: Reusable logic extracted into custom hooks
3. **TypeScript**: Strong typing for better maintainability
4. **External Data**: Stories fetched from external JSON file for easy content management

### Mobile-First Approach

1. **Touch Interactions**: Comprehensive touch gesture support
2. **Responsive Design**: Optimized for various mobile screen sizes
3. **Touch-Friendly Controls**: Large touch targets and intuitive gestures
4. **Performance**: Optimized for mobile network conditions

### Code Quality

1. **TypeScript**: Full type safety throughout the application
2. **ESLint & Prettier**: Consistent code formatting and linting
3. **Comprehensive Testing**: Unit tests, integration tests, and E2E tests
4. **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🧪 Testing Strategy

### Test Coverage

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Complete user journeys and scenarios
- **Performance Tests**: Load times and responsiveness
- **Accessibility Tests**: ARIA compliance and keyboard navigation

### Test Scenarios Covered

1. **Basic Functionality**:

   - Story list rendering
   - Story viewer opening/closing
   - Navigation between stories
   - Auto-advance functionality

2. **User Interactions**:

   - Click navigation
   - Touch swipe gestures
   - Pause/play controls
   - Keyboard navigation

3. **Edge Cases**:

   - Network failures
   - Image loading errors
   - Empty story lists
   - Single story handling

4. **Performance**:
   - Rapid navigation handling
   - Memory leak prevention
   - Efficient rendering

## 📱 Mobile Optimizations

### Touch Interactions

- **Swipe Gestures**: Left/right swipes for navigation
- **Tap Areas**: Large touch targets for easy interaction
- **Touch Feedback**: Visual feedback for touch interactions

### Performance

- **Viewport Optimization**: Proper viewport meta tag configuration
- **Image Optimization**: Responsive images with appropriate sizes
- **Smooth Animations**: Hardware-accelerated animations using CSS transforms

### UX Considerations

- **Loading States**: Clear loading indicators
- **Error Handling**: User-friendly error messages with retry options
- **Intuitive Navigation**: Clear visual cues for navigation options

## 🔧 Configuration Files

### Tailwind CSS Setup

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom configurations
    },
  },
  plugins: [],
};
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
};
```

## 🐛 Known Issues & Limitations

1. **Offline Support**: Currently requires internet connection for images
2. **Browser Compatibility**: Optimized for modern mobile browsers
3. **Story Persistence**: Stories don't persist between sessions (by design)

## 🔮 Future Enhancements

1. **Story Creation**: Allow users to create and upload stories
2. **User Profiles**: Add user profile management
3. **Story Interactions**: Add reactions, replies, and sharing
4. **Offline Support**: Cache stories for offline viewing
5. **Progressive Web App**: Add PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Instagram's Stories feature
- Icons provided by Lucide React
- Images from Unsplash for demo purposes

---

**Note**: This is a simplified implementation for demonstration purposes. In a production environment, you would need additional features like user authentication, real-time updates, content moderation, and proper backend integration.
