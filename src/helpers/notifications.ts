import {PushNotifications} from "@capacitor/push-notifications";

const addNotificationsListeners = async (
    onRegistrationSuccess: (registrationToken: string) => Promise<any>
) => {
    try {
        await PushNotifications.addListener('registration', async (token) => {
            console.info('Registration token: ', token.value);
            await onRegistrationSuccess(token.value);
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
    } catch (error) {
        console.log('Error in addNotificationListener ', error);
    }
}

const removeNotificationsListeners = async () => {
    await PushNotifications.removeAllListeners()
}

const registerNotifications = async () => {
    try {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            throw new Error('User denied permissions!');
        }

        await PushNotifications.register();
    } catch (error) {
        console.log('Error in registerNotifications ', error);
    }
}

const getDeliveredNotifications = async () => {
    try {

        const notificationList = await PushNotifications.getDeliveredNotifications();
        console.log('delivered notifications', notificationList);
    } catch (error) {
        console.log('Error in getDeliveredNotifications ', error);
    }
}

export {
    registerNotifications,
    addNotificationsListeners,
    getDeliveredNotifications,
    removeNotificationsListeners
}