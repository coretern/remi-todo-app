# 🍎 Remi Todo - Premium Productivity & Cloud Sync

Remi Todo is a **High-Fidelity Productivity Sanctuary** designed for professional mission management. It combines a sleek, minimalist iOS-inspired aesthetic with powerful cloud-synced features to ensure your history is never lost. 

![Remi Todo Banner](https://img.shields.io/badge/Experience-Premium-007AFF?style=for-the-badge&logo=apple)
![Platform-Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)
![Technology-Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase)
![Build-EAS](https://img.shields.io/badge/Build-Expo_EAS-000020?style=for-the-badge&logo=expo)

---

## ✨ Key Features

- 💎 **Glassmorphism UI**: A floating, semi-transparent navigation system with premium spacing.
- ☁️ **Cloud Backup**: All missions and streaks are automatically synced to **Firebase Firestore** seamlessly in the background.
- 🎯 **Gamified Streaks**: Daily task chaining with a mandatory 12-word limit to keep missions highly focused.
- ⏰ **Exact-Time Native Notifications**: Hardcoded Android `SCHEDULE_EXACT_ALARM` permissions to guarantee push notifications fire absolutely instantly down to the minute, bypassing battery Doze throttles.
- 🔄 **History Restore**: Log in on any device to instantly recover your entire mission history. Safely protected by 2-step deletion logic.
- 🏅 **Achievement Certificates**: Dynamic, responsive mastery certificates generated locally upon completing a full multi-day mission streak.
- ⚡ **Highly Optimized Binaries**: Uses Google R8 ProGuard and Resource Shrinking via `expo-build-properties` to drastically reduce `.apk` and `.aab` delivery sizes.

---

## 🛠️ Tech Stack & Dependencies

**Core Engine**
- `react-native` (0.81.5) & `expo` (~54.0.33)
- `expo-router` (~6.0.23) - Advanced link-based nested layout routing.

**State & Persistence**
- `firebase` (^12.11.0) - Firestore Database & Backend Sync
- `@react-native-async-storage/async-storage` (2.2.0) - High-speed local offline persistence.

**Authentication**
- `expo-auth-session` (^55.0.12) - Deep linking Google OAuth logic.

**Design & Device APIs**
- `expo-notifications` (^55.0.11) - Smart push logic & Exact-Alarms hardware hooks.
- `expo-linear-gradient` (^55.0.8) - Premium UI texturing.
- `react-native-view-shot` (^4.0.3) - Real-time Certificate rendering logic.

**Build Pipeline**
- `expo-build-properties` - Automated ProGuard minification algorithm injector.
- `Expo Application Services (EAS)` - Remote Cloud APK compilation.

---

## 📂 Project Structure

```text
todo/
├── app/                        # Main application screens (Expo Router)
│   ├── index.tsx               # Dashboard (Missions Control)
│   ├── new-task.tsx            # Mission creator with 12-word limit & Icons
│   ├── history.tsx             # Accomplished mission logs (Restored from Cloud)
│   ├── settings.tsx            # Google Auth & Theme control
│   ├── developer.tsx           # Developer Bio
│   └── _layout.tsx             # Global navigation & Theme provider
├── services/                   # Cloud logic & Native integrations
│   ├── firebase.ts             # Firestore & Firebase SDK initialization
│   └── SyncService.ts          # Central cloud backup & restore orchestration
├── hooks/                      # Custom React hooks (Logic & State)
│   └── useNotifications.ts     # Expo hardware push notification scheduling
├── context/                    # Global state providers
│   ├── TodoContext.tsx         # Central memory layer syncing local + cloud
│   └── ThemeContext.tsx        # Premium look & feel management
├── components/todo/            # UI Features
│   ├── TodoItem/               # Premium mission rows & checkbox logic
│   └── CertificateModal.tsx    # Responsive Victory Certificate generator
├── assets/                     # Packaged static assets
│   ├── icon/                   # Local custom selection icons (Instagram, YouTube, etc.)
│   └── images/                 # App icons and high-res splashes
├── types/                      # TypeScript definitions (todo.ts)
├── app.json                    # Permissions & Core App Manifest
└── eas.json                    # EAS Cloud Profile (Controls `.apk` building)
```

---

## 🚀 Get Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/coretern/remi-todo-app.git
   cd todo
   npm install
   ```

2. **Run Dev Environment**:
   ```bash
   npx expo start -c
   ```

3. **Build Optimized `.apk`**:
   This uses the predefined `preview` profile to create a fully shrunk installable Android package.
   ```bash
   npx eas-cli build -p android --profile preview
   ```

---

## 👨‍💻 Built with ❤️ by [@anilmonitor](https://www.linkedin.com/in/anilmonitor/)

*Crafted for those who demand beauty in their daily grind.*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anilmonitor/)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@anilmonitor)

---

> *"Your productivity is a reflection of your environment. Remi Todo makes that environment beautiful."* — **ANIL KUMAR**
