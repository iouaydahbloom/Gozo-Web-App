import {FirebaseAnalytics} from "@capacitor-community/firebase-analytics";

async function enableAnalytics() {
    try {
        await FirebaseAnalytics.setCollectionEnabled({
            enabled: true
        });
    } catch (error) {
        console.log('Error in enableAnalytics', error)
    }
}

async function setUserForAnalytics(id: string) {
    try {
        await FirebaseAnalytics.setUserId({
            userId: id
        });
    } catch (error) {
        console.log('Error in setUserForAnalytics', error)
    }
}

async function setUserPropertyForAnalytics(key: string, value: string) {
    try {
        await FirebaseAnalytics.setUserProperty({
            name: key,
            value: value
        });
    } catch (error) {
        console.log('Error in setUserPropertyForAnalytics', error)
    }
}

async function getAppInstanceId() {
    try {
        return FirebaseAnalytics.getAppInstanceId();
    } catch (error) {
        console.log('Error in getAppInstanceId', error)
    }
}

async function setAnalyticsScreenName(name: string) {
    try {
        await FirebaseAnalytics.setScreenName({
            screenName: name
        });
    } catch (error) {
        console.log('Error in setAnalyticsScreenName', error)
    }
}

async function setAnalyticsSessionTimeoutDuration(duration: number = 10000) {
    try {
        await FirebaseAnalytics.setSessionTimeoutDuration({
            duration: 10000
        });
    } catch (error) {
        console.log('Error in setAnalyticsSessionTimeoutDuration', error)
    }
}

export {
    enableAnalytics,
    getAppInstanceId,
    setAnalyticsScreenName,
    setUserForAnalytics,
    setUserPropertyForAnalytics,
    setAnalyticsSessionTimeoutDuration
}