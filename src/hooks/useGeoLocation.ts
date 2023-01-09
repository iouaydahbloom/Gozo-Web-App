import { useEffect } from "react"
import { cloudFunctionName } from "../constants/cloudFunctionName";
import { getCurrentGeoPosition } from "../helpers/geoLocation";
import useAuthentication from "./useAuthentication";
import useCloud from "./useCloud";

const useGeoLocation = () => {

    const { run } = useCloud();
    const { isAuthenticated } = useAuthentication();

    function updateCurrentPosition(longitude: number, latitude: number) {
        run(
            cloudFunctionName.updateUserGeoLocation,
            { longitude, latitude },
            () => true,
            true
        )
    }

    useEffect(() => {
        if (!isAuthenticated) return;

        getCurrentGeoPosition()
            .then(position => {
                updateCurrentPosition(position.coords.longitude, position.coords.latitude);
            })
            .catch(error => {
                console.error(error);
            });
    }, [isAuthenticated])
}

export default useGeoLocation;