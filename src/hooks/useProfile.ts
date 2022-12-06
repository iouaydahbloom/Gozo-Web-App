import { useEffect, useState } from "react";
import { ProfileDetailsDTO } from "../dto/ProfileDetailsDTO";
import { ProfileDetails, ProfileSocialAccount } from "../models/profileDetails";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import { SocialAccountTypeDTO } from "../dto/socialAccountTypeDTO";
import { SocialAccountType } from "../models/socialAccountType";
import useCloud from "./useCloud";

const useProfile = () => {

    const [profileDetails, setProfileDetails] = useState<ProfileDetails>();
    const [isLoading, setIsLoading] = useState(false);
    const { run } = useCloud();

    async function getProfileDetails() {
        return run(
            cloudFunctionName.profileDetails,
            null,
            (result: ProfileDetailsDTO) => ProfileDetails.getFromDTO(result),
            true
        )
            .then(result => {
                if (result.isSuccess) return result.data
            })
    }

    async function getSocialAccountTypes() {
        return run(
            cloudFunctionName.socialAccountTypes,
            null,
            (res: SocialAccountTypeDTO[]) => res.map(sat => SocialAccountType.getFromDTO(sat))
        )
            .then(result => {
                if (result.isSuccess) return result.data
            })
    }

    async function updateProfileDetails(user: ProfileDetails) {
        setIsLoading(true)
        return run(
            cloudFunctionName.updateProfileDetails,
            { user: user.toDTO() },
            (result: ProfileDetailsDTO) => ProfileDetails.getFromDTO(result),
            true
        )
            .finally(() => setIsLoading(false))
    }

    function buildProfileWithSocialAccounts(profileInfo?: ProfileDetails, socialAccountTypes?: SocialAccountType[]) {
        if (profileInfo && socialAccountTypes) {
            const socialAccounts = socialAccountTypes.map(sat => {
                const socialAccount = profileInfo?.socialAccounts?.find(sa => sa.type == sat.key);
                if (socialAccount) return socialAccount;

                return ProfileSocialAccount.init(sat);
            })

            profileInfo.socialAccounts = socialAccounts;
        }

        return profileInfo;
    }

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            getProfileDetails(),
            getSocialAccountTypes()
        ])
            .then(result => {
                let profile = result[0];
                const socialAccountTypes = result[1];
                profile = buildProfileWithSocialAccounts(profile, socialAccountTypes);
                setProfileDetails(profile);
            })
            .finally(() => setIsLoading(false));
    }, [])

    return {
        fetchProfileDetails: getProfileDetails,
        updateProfileDetails,
        profileDetails,
        isLoading
    }
}

export default useProfile;