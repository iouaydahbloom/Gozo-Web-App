import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import { useEffect } from "react";
import { enableCrashAnalytics } from "../helpers/appCrashAnalytics";
import useAuthentication from "./useAuthentication";

const useAppAnalytics = () => {

    const { user } = useAuthentication();

    function setUserId() {
        if (!user?.id) return;
        FirebaseAnalytics.setUserId({
            userId: user.id
        });
    }

    function setUserProperty() {
        if (!user?.id) return;
        FirebaseAnalytics.setUserProperty({
            name: "username",
            value: user.username
        });
    }

    useEffect(() => {
        setUserId();
        setUserProperty();
    }, [user?.id])


    useEffect(() => {
        enableCrashAnalytics();
    }, [])
}

export default useAppAnalytics;