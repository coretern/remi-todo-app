# 🍎 Remi Todo - Premium Productivity & Cloud Sync

Remi Todo is a **High-Fidelity Productivity Sanctuary** designed for professional mission management. It combines a sleek, minimalist iOS-inspired aesthetic with powerful cloud-synced features to ensure your history is never lost.

![Remi Todo Banner](https://img.shields.io/badge/Experience-Premium-007AFF?style=for-the-badge&logo=apple)
![Platform-Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)
![Technology-Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase)

---

## ✨ Key Features

- 💎 **Glassmorphism UI**: A floating, semi-transparent navigation system with premium spacing.
- ☁️ **Cloud Backup**: All missions are automatically synced to **Firebase Firestore** via Google Login.
- 📅 **Google Calendar Sync**: Your scheduled missions are pushed to your **Google Calendar** with reminder preferences.
- 🔔 **Smart Advance Reminders**: Set custom alerts for 2min, 10min, or custom offsets before your mission deadline.
- 🔄 **History Restore**: Log in on any device to instantly recover your entire mission history.
- 🌙 **Adaptive Themes**: Perfected Light and Dark modes with curated, eye-safe palettes.
- ⚡ **Instant Launch**: Optimized splash screen and high-resolution `remiicon.png` branding.

---

## 🛠️ Tech Stack

- **Core Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 54+)
- **Runtime Engine**: [Hermes](https://hermesengine.dev/) (High-performance JS engine for Android)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Link-based nested navigation)
- **State Management**: React Context API (`TodoContext`, `ThemeContext`)
- **Persistence**: 
  - [Firebase Firestore](https://firebase.google.com/docs/firestore) (Cloud)
  - [@react-native-async-storage](https://react-native-async-storage.github.io/async-storage/) (Local)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth) with Google Provider
- **Notifications**: [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) (Local Scheduling & Smart Logic)
- **UI Components**: [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/), React Native Animated
- **Icons**: [Ionicons](https://ionic.io/ionicons) via `@expo/vector-icons`
- **Build System**: [EAS Build](https://docs.expo.dev/build/introduction/) (Optimized for .aab and .apk)

---

## 📂 Project Structure

```text
todo/
├── app/                  # Main application screens (Expo Router)
│   ├── index.tsx         # Dashboard (Missions Control)
│   ├── new-task.tsx      # Mission creator with Smart Reminders
│   ├── history.tsx       # Accomplished mission logs (Restored from Cloud)
│   ├── settings.tsx      # Sync Management & Theme control
│   ├── developer.tsx     # Developer Bio & Vision
│   └── _layout.tsx       # Global navigation & Theme provider
├── services/             # Cloud logic & Native integrations
│   ├── firebase.ts       # Firestore & Firebase SDK initialization
│   └── SyncService.ts    # Google Calendar & Cloud backup orchestration
├── hooks/                # Custom React hooks (Logic & State)
│   ├── useTodos.ts       # Core state management with Cloud sync
│   └── useNotifications.ts # Smart reminder scheduling system
├── context/              # Global state providers
│   ├── TodoContext.tsx   # Mission & Persistence logic
│   └── ThemeContext.tsx  # Premium look & feel management
├── components/           # Reusable UI components
│   └── todo/             # Mission-specific components (TodoItem, Search)
├── assets/               # High-res icons (remiicon.png), splash, and images
├── constants/            # Design tokens (Colors, Typography)
├── app.json              # App configuration (ID: com.remi.todoapp)
└── eas.json              # Production build profiles for APK/AAB
```

---

## 🚀 Get Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/monitorweb3/RemiTodo-app.git
   cd todo
   npm install
   ```

2. **Database Setup**: 
   Add your keys to `services/firebase.ts` and configure Google Cloud.

3. **Run Preview**:
   ```bash
   npx expo start
   ```

4. **Production Build**:
   ```bash
   eas build -p android --profile production
   ```

---

## 👨‍💻 Built with ❤️ by [@anilmonitor](https://www.linkedin.com/in/anilmonitor/)

*Crafted for those who demand beauty in their daily grind.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anilmonitor/)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@anilmonitor)

---

> *"Your productivity is a reflection of your environment. Remi Todo makes that environment beautiful."* — **ANIL KUMAR**
