# GOZO IONIC APP

Gozo ionic APP is a frontend Ionic React mobile application.

## Installation

use node version 14.18.1 for a compatible usage.

```bash
npm install
```

## Deployment
### Android
The app come with two flavors (enviroments), **dev** and **demo** could be managed from **android/app/build.gradle**

```gradle
 flavorDimensions 'environment'
    productFlavors {
        dev {
            dimension 'environment'
            applicationIdSuffix '.dev'
            manifestPlaceholders = [displayName:'GOZO - DEV']
            versionCode = 1
            versionName '1.920 beta'
        }
        demo {
            dimension 'environment'
            applicationIdSuffix '.demo'
            manifestPlaceholders = [displayName:'GOZO']
            versionCode = 1
            versionName '1.15 beta'
        }
    }
```

On each android build update the versionName for a better versioning flow

```gradle
versionCode = 1
versionName '1.15 beta'
```

To create an android realse build after updating the version, run:
#### Dev enviroment build
```bash
npm run build-android
```

#### Demo enviroment build
```bash
npm run build-android:demo
```
Android Studio will open automatically:

* First time building android package, For Package **@awesome-cordova-plugins/barcode-scanner**, Change the way to use this plugin in: **Android Studio > Project Structure > Dependencies**
* Build Signed APK
* Sign the APK using **gozo-keystore.jks** located in the application root folder (Credentials provided privately)
* Locate APK
* Rename APK to **Gozo-{enviroment}-{versionName}.apk**

## License
[MIT](https://choosealicense.com/licenses/mit/)