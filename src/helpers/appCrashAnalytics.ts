import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';

async function enableCrashAnalytics() {
    if (await FirebaseCrashlytics.isEnabled()) return;
    await FirebaseCrashlytics.setEnabled({ enabled: true });
}

async function crashApp() {
    await FirebaseCrashlytics.crash({ message: 'Just a test crash !' });
}

export {
    enableCrashAnalytics,
    crashApp
}
