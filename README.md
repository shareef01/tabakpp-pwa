# TABAK++ | High-Fidelity Health Optimization Registry

TABAK++ is a professional, production-grade Progressive Web App (PWA) built to solve "tracking friction" in behavioral health change. It replaces generic counting tools with a high-fidelity, rewarding interface designed for zero-latency data entry and real-time visualization.

**Live Production Link:** [https://tabakpp.web.app](https://tabakpp.web.app)

---

## 🖼️ Visual Showcase

### 📊 Dashboard (Track)
A high-density grid tracking dashboard that adapts from an 11px compact mobile view to a 7xl wide desktop command center.
![Track Screen](https://raw.githubusercontent.com/shareef01/tabakpp-pwa/main/public/screenshots/track.png)

### 📈 Analytics (History)
High-fidelity historical data visualization showing daily velocity and long-term health trends.
![History Screen](https://raw.githubusercontent.com/shareef01/tabakpp-pwa/main/public/screenshots/history.png)

### ⚙️ Identity & Controls (Settings)
Sophisticated identity management and "Obsidian Glass" styling with real-time cloud synchronization.
![Settings Screen](https://raw.githubusercontent.com/shareef01/tabakpp-pwa/main/public/screenshots/settings.png)

---

## 🎯 Key Features
*   **Visual Urgency & Rewards**: High-fidelity 3D gauges and progress rings that transform raw counts into visual urgency and positive reinforcement (XP, Savings, Health metrics).
*   **Real-Time Cloud Sync**: Seamless cross-device synchronization using Firebase Firestore listeners—entry on one device reflects instantly on all other active sessions.
*   **Identity Personalization**: Custom avatar synchronization using Firestore-Base64 storage for free-tier optimization and zero-latency local previews.
*   **Obsidian Design System**: A custom "Glassmorphism" aesthetic featuring 32px standard curves, 70% contrast hardening for maximum legibility, and hardware-accelerated animations.

---

## 📂 Project Structure

*   `src/components/`: Reusable UI components categorized by feature (auth, dashboard, history, layout, modals, settings).
*   `src/context/`: React Context providers for global state management (e.g., `AuthContext`).
*   `src/hooks/`: Custom hooks for encapsulated logic (e.g., `useRegistry` for data orchestration).
*   `src/services/`: Direct interfaces with external services like Firebase Firestore.
*   `src/utils/`: Pure helper functions for formatting and calculations.
*   `src/App.jsx`: Main application orchestrator and routing hub.
*   `src/main.jsx`: Application entry point.

---

## 🛠️ Technical Stack
The app is engineered with a focus on performance, security, and architectural integrity.

*   **Frontend Core**: React.js (Functional Hooks + Context API)
*   **Architecture**: MVVM (Model-View-ViewModel) to decouple complex health calculations from UI rendering.
*   **Persistence**: Firebase Auth & Firestore (Real-time `onSnapshot` architecture).
*   **Styling**: Tailwind CSS (Standardized 4pt spacing grid + custom design system constants).
*   **Animations**: Framer Motion (GPU-accelerated `scaleX` and `transform` logic for 60FPS interaction).
*   **Infrastructure**: PWA Standalone configuration for native installation on iOS/Android.

---

## 📲 Native Installation
For a true native-app experience (no browser bars, full-screen interaction):

### **iOS (Safari)**
1. Visit the live URL.
2. Tap the **Share** button.
3. Select **"Add to Home Screen"**.

### **Android (Chrome)**
1. Visit the live URL.
2. Tap the **Menu** (three dots).
3. Select **"Install App"**.

---
**TABAK++ is optimized for speed, legibility, and professional behavioral tracking.**
*Copyright © 2024 TABAK++ Systems.*
