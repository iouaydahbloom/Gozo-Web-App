# GOZO IONIC APP

Gozo ionic APP is a frontend Ionic React mobile application.

## Installation

use node version 14.18.1 for a compatible usage.

```bash
npm install
```

## Deployment
### Android

* Update build version ex: (1.1) in
**android/app/build.gradle** on each build

```gradle
versionCode 1
versionName "1.2"
```

* Create an android build
```bash
ionic capacitor build android
```
Open Android Studio:

* First time building android package, For Package **@awesome-cordova-plugins/barcode-scanner**, Change the way to use this plugin in: **Android Studio > Project Structure > Dependencies**
* Build APK
* Locate APK
* Rename APK to **GOZO-{versionName}.apk**

## License
[MIT](https://choosealicense.com/licenses/mit/)