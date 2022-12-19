import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';

async function enableCrashAnalytics() {
    try {
        if (await FirebaseCrashlytics.isEnabled()) return;
        await FirebaseCrashlytics.setEnabled({ enabled: true });
    } catch (error) {
        console.log('Error with FirebaseCrashlytics enable', error);
    }
}

async function crashApp() {
    try {
        await FirebaseCrashlytics.crash({ message: 'Just a test crash !' });
    } catch (error) {
        console.log('Error with FirebaseCrashlytics crashing test', error);
    }
}

export {
    enableCrashAnalytics,
    crashApp
}
