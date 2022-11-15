import { useEffect, useState } from "react";
import { ProfileDetailsDTO } from "../dto/ProfileDetailsDTO";
import { ProfileDetails } from "../models/profileDetails";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useAuthentication from "./useAuthentication";
import useCloud from "./useCloud";

const useProfile = () => {
    const [profileDetails, setProfileDetails] = useState<ProfileDetails>()
    const [ isLoading, setIsLoading ] = useState(false);
    const { user } = useAuthentication();
    const { run } = useCloud();

    async function fetchProfileDetails() {
        setIsLoading(true)
        return run(cloudFunctionName.profileDetails,
            {
                id: user?.id
            },
            (result: ProfileDetailsDTO) => ProfileDetails.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoading(false))
    }

    async function updateProfileDetails(user: ProfileDetails) {
        setIsLoading(true)
        return run(cloudFunctionName.updateProfileDetails,
            {
                user: user.toDTO()
            },
            (result: ProfileDetailsDTO) => ProfileDetails.getFromDTO(result),
            true)
            .then(result => {
                return result
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchProfileDetails().then(details => {
            if (details) setProfileDetails(details)
        })
    }, [])


    return {
        fetchProfileDetails,
        updateProfileDetails,
        profileDetails,
        isLoading
    }
}

export default useProfile;