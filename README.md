# RiseWise - Smart Alarm Clock App 🕐

A modern, intelligent alarm clock application built with React Native and Expo, designed to make waking up a personalized, refreshing, and stress-free experience.

## 🎯 Features

### Core Features

- **Dynamic Dashboard (Home Screen)**
  - Real-time clock display with multiple styles (digital, analog, minimalist)
  - Current date and time auto-updated every second
  - Next upcoming alarm display
  - Motivational quotes for each morning
  - Active alarms count and statistics
  - Weather integration ready

- **Smart Alarm Creation**
  - Flexible time picker (AM/PM and 24-hour formats)
  - Custom alarm labels
  - Multiple repeat options: Daily, Weekdays, Weekends, or Custom days
  - Choose from various alarm tones (system, nature, music)
  - Vibration toggle
  - Time picker with increment/decrement buttons

- **Alarm Management**
  - List view of all created alarms
  - Toggle alarms on/off with visual indicators
  - Edit existing alarms
  - Delete alarms
  - Color-coded active status indicators

- **Interactive Dismissal Screen**
  - Large, easy-to-tap dismiss button
  - Multiple snooze options (5, 10, 15 minutes)
  - Animated ringing bell with haptic feedback
  - Interactive dismiss challenges:
    - **Math Challenge**: Solve a simple math problem
    - **Shake Challenge**: Shake phone 10 times
    - **Quick Dismiss**: Standard wake-up

- **Smart Features**
  - Motivational quotes on wake-up
  - Adaptive wake modes
  - Snooze history tracking
  - Theme personalization (light/dark modes)
  - Multiple clock style options

## 📁 Project Structure

```
ALARM_CLOCK/
├── src/
│   ├── assets/              # Images, icons, sounds
│   ├── components/          # Reusable UI components
│   │   └── Common.tsx       # Clock, buttons, alarm cards
│   ├── context/             # Global state management
│   │   └── AlarmContext.tsx # Alarm state & actions
│   ├── hooks/               # Custom React hooks
│   │   └── useAlarms.ts     # Time, countdown, theme hooks
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx # Stack navigator setup
│   ├── screens/             # Screen components
│   │   ├── HomeScreen.tsx           # Main dashboard
│   │   ├── AlarmCreationScreen.tsx  # Create/edit alarm
│   │   └── AlarmRingingScreen.tsx   # Dismissal interface
│   ├── services/            # Business logic & API
│   │   ├── storageService.ts      # AsyncStorage operations
│   │   └── notificationService.ts # Expo Notifications
│   ├── types/               # TypeScript interfaces & types
│   │   ├── alarm.ts         # Alarm data structures
│   │   └── constants.ts     # Predefined data (tones, quotes)
│   └── utils/               # Utility functions
│       └── helpers.ts       # Time, alarm, math utilities
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Clone the repository**
   ```bash
   cd ALARM_CLOCK
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Expo development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/emulator**
   ```
   Press 'a' for Android emulator
   Press 'i' for iOS simulator
   Press 'w' for web
   ```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react-native` | Latest | Core framework |
| `expo` | ~51.0.0 | Managed React Native |
| `@react-navigation` | v6+ | Screen navigation |
| `expo-notifications` | ~0.28.0 | Scheduled alarms |
| `expo-av` | ~14.0.0 | Audio playback |
| `@react-native-async-storage` | ^1.21.0 | Local data persistence |
| `react-native-reanimated` | ~3.8.0 | Smooth animations |
| `react-native-paper` | ^5.12.0 | Material Design components |

## 🎨 UI Components

### Common Components

- **DigitalClock**: 24-hour digital time display
- **MinimalistClock**: Simple, elegant time display with AM/PM
- **FloatingButton**: Floating action button for creating alarms
- **AlarmCard**: Individual alarm display with controls
- **Button**: Reusable button with variants (primary, secondary, danger)
- **ToggleSwitch**: On/off toggle component

## 🔧 Configuration

### Notification Channels (Android)

Notifications are configured with:
- High importance level
- Vibration pattern: `[0, 200, 100, 200]`
- Custom light color: `#FF6B6B`

### Theme Colors

- **Primary**: `#FF6B6B` (Red)
- **Background**: `#ffffff` (light) / `#1a1a1a` (dark)
- **Success**: `#51cf66` (Green)
- **Border**: `#e0e0e0` (light) / `#3d3d3d` (dark)

## 💾 Data Persistence

All data is stored locally using **AsyncStorage**:
- Alarms list
- User preferences
- Snooze history

No internet connection required for core functionality!

## 🔔 Notification System

- Scheduled notifications using `expo-notifications`
- Supports recurring alarms for selected days
- Schedules 4 weeks in advance for optimal performance
- Handles notification responses and navigation

## 🎯 Usage Examples

### Create an Alarm
```typescript
const alarm: Alarm = {
  id: 'alarm_1234567890',
  time: '07:00',
  label: 'Gym Time',
  isActive: true,
  repeatDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  tone: ALARM_TONES[0],
  vibrationEnabled: true,
  createdAt: new Date().toISOString(),
};

await addAlarm(alarm);
```

### Toggle Alarm
```typescript
await toggleAlarmStatus(alarmId, true); // Enable
await toggleAlarmStatus(alarmId, false); // Disable
```

### Handle Snooze
```typescript
await snoozeAlarm(alarmId, 5); // Snooze for 5 minutes
```

## 🌙 Dark Mode

The app supports system dark mode with automatic theme switching:
- Light theme: White background, dark text
- Dark theme: Dark background, light text
- Adaptive theme: Follows system settings

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web (experimental)

## 🚧 Future Enhancements

- [ ] Weather integration
- [ ] Sleep analytics dashboard
- [ ] Cloud sync across devices
- [ ] Voice commands
- [ ] Bedtime reminders
- [ ] Custom alarm ringtones upload
- [ ] Sleep tracking integration
- [ ] Social features

## 📝 Notes

- Notifications require permission grant on first app launch
- Android requires API level 26+
- iOS requires iOS 13+
- Alarms continue to work even when app is closed (Expo managed)

## 🐛 Troubleshooting

### Notifications not working
1. Check permissions are granted
2. Verify notification channel is configured
3. Check device notification settings

### Alarms not persisting
1. Check AsyncStorage permissions
2. Verify device has sufficient storage
3. Check console for storage errors

### Time picker issues
1. Ensure time format is `HH:mm`
2. Use 24-hour format internally
3. Convert to 12-hour for display

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 👨‍💻 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Check Expo documentation

---

**Built with ❤️ using React Native & Expo**
#   c o d e s o f t _ t a s k - 2  
 