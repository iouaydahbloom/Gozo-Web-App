import { useEffect } from "react";
import { useLocation } from "react-router";
import { enableCrashAnalytics } from "../helpers/appCrashAnalytics";
import { enableAnalytics, setAnalyticsSessionTimeoutDuration, setAnalyticsScreenName, setUserForAnalytics, setUserPropertyForAnalytics } from "../helpers/appUsageAnalytics";
import useAuthentication from "./useAuthentication";

const useAppAnalytics = () => {
    const { user } = useAuthentication();
    const { pathname } = useLocation();

    function setScreen() {
        const screenPathName = pathname.substring(pathname.lastIndexOf('/') + 1);
        setAnalyticsScreenName(screenPathName);
    }

    useEffect(() => {
        if (!user?.id) return;
        setUserForAnalytics(user.id);
        setUserPropertyForAnalytics("username", user.username);
    }, [user?.id])

    useEffect(() => {
        enableAnalytics();
        enableCrashAnalytics();
        setAnalyticsSessionTimeoutDuration();
    }, [])

    useEffect(() => {
        setScreen();
    }, [pathname])
}

export default useAppAnalytics;