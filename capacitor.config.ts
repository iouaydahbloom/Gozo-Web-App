import {CapacitorConfig} from '@capacitor/cli';

const getDeviceConfig = () => {
    switch (process.env.NODE_ENV) {
        case 'demo':
            return {
                android: {
                    flavor: 'demo'
                },
                ios: {
                    scheme: 'App',
                }
            }

        default:
            return {
                android: {
                    flavor: 'dev'
                },
                ios: {
                    scheme: 'App Dev',
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
    android: getDeviceConfig().android,
    ios: getDeviceConfig().ios
}

export default config;
