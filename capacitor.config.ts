import { CapacitorConfig } from '@capacitor/cli';

const getDeviceConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'demo':
      return {
        android: {
          flavor: 'demo'
        }
      }

    default:
      return {
        android: {
          flavor: 'dev'
        }
      }
  }
}

const config: CapacitorConfig = {
  appId: "gozo.app.mvp",
  appName: "GOZO",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    }
  },
  android: getDeviceConfig().android
}

export default config;
