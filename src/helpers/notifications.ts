//import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";

// external required step
// register for push
// await PushNotifications.requestPermissions();
// await PushNotifications.register();

// // now you can subscribe to a specific topic
// FCM.subscribeTo({ topic: "test" })
//     .then((r) => alert(`subscribed to topic`))
//     .catch((err) => console.log(err));

// // Unsubscribe from a specific topic
// FCM.unsubscribeFrom({ topic: "test" })
//     .then(() => alert(`unsubscribed from topic`))
//     .catch((err) => console.log(err));

// // Get FCM token instead the APN one returned by Capacitor
// FCM.getToken()
//     .then((r) => alert(`Token ${r.token}`))
//     .catch((err) => console.log(err));

// // Remove FCM instance
// FCM.deleteInstance()
//     .then(() => alert(`Token deleted`))
//     .catch((err) => console.log(err));

// // Enable the auto initialization of the library
// FCM.setAutoInit({ enabled: true }).then(() => alert(`Auto init enabled`));

// // Check the auto initialization status
// FCM.isAutoInitEnabled().then((r) => {
//     console.log("Auto init is " + (r.enabled ? "enabled" : "disabled"));
// });

const addListeners = async () => {
    await PushNotifications.addListener('registration', token => {
        console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
        console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
}

const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();
    console.log('permstatus', permStatus);

    if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
    }

    console.log('permstatus', permStatus);

    if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
}

const getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
}

export {
    registerNotifications,
    addListeners,
    getDeliveredNotifications
}