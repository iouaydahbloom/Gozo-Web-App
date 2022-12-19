import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";

async function enableAnalytics() {
    await FirebaseAnalytics.setCollectionEnabled({
        enabled: true
    });
}

async function setUserForAnalytics(id: string) {
    await FirebaseAnalytics.setUserId({
        userId: id
    });
}

async function setUserPropertyForAnalytics(key: string, value: string) {
    await FirebaseAnalytics.setUserProperty({
        name: key,
        value: value
    });
}

async function getAppInstanceId() {
    return FirebaseAnalytics.getAppInstanceId();
}

async function setAnalyticsScreenName(name: string) {
    await FirebaseAnalytics.setScreenName({
        screenName: name
    });
}

async function setAnalyticsSessionTimeoutDuration(duration: number = 10000) {
    await FirebaseAnalytics.setSessionTimeoutDuration({
        duration: 10000
    });
}

export {
    enableAnalytics,
    getAppInstanceId,
    setAnalyticsScreenName,
    setUserForAnalytics,
    setUserPropertyForAnalytics,
    setAnalyticsSessionTimeoutDuration
}