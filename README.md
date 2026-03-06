# 🍎 Remi Todo - Premium iOS Experience

Remi Todo is not just another task list; it's a **High-Fidelity Productivity Sanctuary**. Designed with a minimalist heart and a premium soul, it brings the sleek, sophisticated aesthetic of modern iOS applications to your daily mission management.

![Remi Todo Banner](https://img.shields.io/badge/Experience-Premium-007AFF?style=for-the-badge&logo=apple)
![Platform-Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=for-the-badge&logo=android)
![Technology-Expo](https://img.shields.io/badge/Technology-Expo-000020?style=for-the-badge&logo=expo)

---

## ✨ Key Features

- 💎 **Glassmorphism UI**: A floating, semi-transparent navigation system that feels alive.
- 📳 **Haptic Feedback**: Physical "Taptic" sensations for every major interaction.
- 🎉 **Confetti Celebration**: Professional victory animations when missions are accomplished.
- 🔔 **Smart Alarms**: Native mission reminders to keep you on track.
- 🎨 **Apple Design Language**: Sophisticated shadows, squircle logos, and official iOS-blue branding.

---

## 📂 Project Structure

```text
todo/
├── app/                # Main application screens (Expo Router)
│   ├── index.tsx       # Dashboard (Missions Control)
│   ├── history.tsx     # Accomplished mission logs
│   ├── about.tsx       # Branded about & developer credits
│   └── _layout.tsx     # Global navigation & Sidebar logic
├── components/         # Reusable UI components
│   ├── todo/           # Mission-specific components (Input, Items)
│   └── ui/             # Core UI elements (External)
├── hooks/              # Custom React hooks (Logic & State)
│   ├── useTodos.ts     # Core mission management logic
│   └── useNotifications.ts # Reminder scheduling system
├── assets/             # Images, fonts, and static resources
├── constants/          # Global theme tokens and strings
├── types/              # TypeScript definitions for the project
├── scripts/            # Utility and maintenance scripts
└── eas.json            # Build configuration (APK/AAB)
```

---

## 🛠️ Get Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/monitorweb3/RemiTodo-app.git
   cd todo
   npm install
   ```

2. **Run Locally**:
   ```bash
   npx expo start
   ```

3. **Build APK (Testing)**:
   ```bash
   npx eas build --platform android --profile preview
   ```

---

## 👨‍💻 Built with ❤️ by ANIL

Crafted with a passion for high-end UI/UX and mobile engineering.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anilmonitor)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/anilmonitor)

---

> *"Your productivity is a reflection of your environment. Remi Todo makes that environment beautiful."* — **ANIL**
