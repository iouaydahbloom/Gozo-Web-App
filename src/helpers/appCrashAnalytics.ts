import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';

async function enableCrashAnalytics() {
    try {
        if (await FirebaseCrashlytics.isEnabled()) return;
        await FirebaseCrashlytics.setEnabled({ enabled: true });
    } catch (error) {
        console.log('Error with FirebaseCrashlytics ', error);
    }
}

async function crashApp() {
    await FirebaseCrashlytics.crash({ message: 'Just a test crash !' });
}

export {
    enableCrashAnalytics,
    crashApp
}
