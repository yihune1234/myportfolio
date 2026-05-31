import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yihunebelay.portfolio',
  appName: 'Yihune Belay Portfolio',
  webDir: 'dist/spa',
  // For development, set the server URL to load live from deployed site:
  // Uncomment the line below and replace with your deployed URL to enable live updates
  // without rebuilding. Comment it out or set to undefined to use local web build.
  // server: {
  //   url: 'https://myportfolio-1-01m7.onrender.com',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#050816',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    },
  },
};

export default config;