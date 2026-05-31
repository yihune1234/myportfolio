# Mobile App Setup Guide — Capacitor + Android

This guide explains how to build and run your portfolio as a native Android app using Capacitor. The mobile app shares the **exact same codebase** as the web app.

## Architecture Overview

```
GitHub Repo
    │
    ├── Web: push → Render auto-deploys
    │
    └── Mobile: npm run build → npx cap sync → Android Studio → APK
```

One codebase. Two platforms. No paid services.

---

## Prerequisites

- **Node.js** 18+ installed
- **Android Studio** (with Android SDK)
- **Java JDK 17** (bundled with Android Studio)
- An Android device or emulator

---

## Project Structure (after Capacitor setup)

```
frontend/
├── android/                  # Native Android project (auto-generated)
│   ├── app/
│   │   └── src/
│   │       └── main/
│   │           ├── assets/public/   # Web build copied here
│   │           ├── java/            # Native Android code
│   │           └── res/             # Icons, splash screen, etc.
│   ├── build.gradle
│   └── gradle/
├── capacitor.config.ts       # Capacitor configuration
├── dist/spa/                 # Web build output
├── node_modules/
├── client/                   # React app source (unchanged)
├── package.json              # Added Capacitor scripts
└── ...
```

---

## Setup Commands (already completed)

These commands have already been run. You only need them if setting up from scratch:

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor
npx cap init "Yihune Belay Portfolio" "com.yihunebelay.portfolio" --web-dir dist/spa

# 3. Add Android platform
npx cap add android
```

---

## How to Run

### 1. Web (unchanged)
```bash
cd frontend
npm run dev        # Local dev server at localhost:8080
```

### 2. Mobile App (local build)

Build the web app and sync to Android:

```bash
cd frontend
npm run build:android
```

Then open in Android Studio:

```bash
npx cap open android
```

In Android Studio:
- Wait for Gradle sync to finish
- Select a device/emulator
- Click **Run** (green triangle)

### 3. Faster Development — Live Server Mode

For rapid testing without rebuilding every time, uncomment the `server` section in `capacitor.config.ts`:

```ts
server: {
  url: 'https://myportfolio-1-01m7.onrender.com',
  cleartext: true
},
```

After uncommenting, run:

```bash
npx cap sync
npx cap open android
```

The app will load content directly from your deployed website. Every push to GitHub → Render redeploy will instantly reflect in the mobile app.

**To switch back to offline/local mode**, comment out the `server` block and rebuild:
```bash
npm run build:android
npx cap open android
```

---

## How to Generate an APK

### Debug APK (for testing)
1. `cd frontend && npm run build:android`
2. `npx cap open android`
3. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. APK location: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (for sharing)

1. Generate a keystore (one-time):
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Place `my-release-key.keystore` in `frontend/android/app/`

3. Create `frontend/android/key.properties`:
   ```
   storePassword=your_password
   keyPassword=your_password
   keyAlias=my-alias
   storeFile=my-release-key.keystore
   ```

4. In Android Studio: **Build → Generate Signed Bundle / APK → APK**
5. Select the keystore, enter passwords, select `release`, finish
6. APK location: `frontend/android/app/build/outputs/apk/release/app-release.apk`

---

## npm Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web dev server |
| `npm run build` | Build web + sync Capacitor |
| `npm run build:android` | Build web + sync Android |
| `npm run cap:sync` | Sync web build to Android |
| `npm run cap:open:android` | Open Android Studio |
| `npm run cap:copy` | Copy web assets to Android |

---

## How Web + Mobile Stay Synced via GitHub

1. You push changes to GitHub (frontend code, API, etc.)
2. Render detects the push and auto-deploys the web app
3. For mobile: pull latest code → `npm run build:android` → `npx cap open android` → Run
4. If using live server mode (see above), the mobile app loads the latest deployed website directly — no rebuild needed.

### Recommended Workflow

For **most** updates:
1. Edit code → push to GitHub → Render deploys web
2. Mobile app with live server mode loads updated site instantly

For **offline-capable** releases:
1. Pull latest → `npm run build:android` → open in Android Studio → generate APK

---

## Troubleshooting

### "Gradle build failed"
- Ensure Android SDK is installed (Tools → SDK Manager in Android Studio)
- Ensure `ANDROID_HOME` is set in environment variables

### White screen on app launch
- Make sure `npm run build` succeeded before `npx cap sync`
- Check Android Studio Logcat for errors

### CORS errors in live server mode
- The deployed site already handles CORS for the backend
- If issues occur, check that the server's `allowedOrigins` includes `capacitor://localhost` and `http://localhost`