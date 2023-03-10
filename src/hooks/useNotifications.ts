import {useEffect} from "react";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import {addNotificationsListeners, registerNotifications, removeNotificationsListeners} from "../helpers/notifications";
import useAuthentication from "./useAuthentication";
import useCloud from "./useCloud";

const useNotifications = () => {

    const {run} = useCloud();
    const {isAuthenticated} = useAuthentication();

    function onNotificationRegistration(token: string) {
        return run(
            cloudFunctionName.updateUserFcmToken,
            {registrationToken: token},
            () => true,
            true
        );
    }

    useEffect(() => {
        if (!isAuthenticated) {
            removeNotificationsListeners();
            return;
        }

        addNotificationsListeners(onNotificationRegistration);
        registerNotifications();
    }, [isAuthenticated])
}

export default useNotifications;