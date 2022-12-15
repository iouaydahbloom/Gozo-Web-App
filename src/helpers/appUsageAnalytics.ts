import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";

async function enableAnalytics() {
    await FirebaseAnalytics.setCollectionEnabled({
        enabled: true
    });
}

async function setUserId(id: string) {
    await FirebaseAnalytics.setUserId({
        userId: id
    });
}

async function setUserProperty(key: string, value: string) {
    await FirebaseAnalytics.setUserProperty({
        name: key,
        value: value
    });
}

async function getAppInstanceId() {
    return FirebaseAnalytics.getAppInstanceId();
}

async function setScreenName(name: string, alias: string) {
    await FirebaseAnalytics.setScreenName({
        screenName: "login",
        nameOverride: "LoginScreen",
    });
}

