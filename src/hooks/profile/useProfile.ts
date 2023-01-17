import {ProfileDetailsDTO} from "../../dto/ProfileDetailsDTO";
import {ProfileDetails, ProfileSocialAccount} from "../../models/profileDetails";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {SocialAccountTypeDTO} from "../../dto/socialAccountTypeDTO";
import {SocialAccountType} from "../../models/socialAccountType";
import useCloud from "../useCloud";
import useDataQuery from "../queryCaching/useDataQuery";
import useDataMutation from "../queryCaching/useDataMutation";
import {profileQueriesIdentity} from "./profileQueriesIdentity";

const useProfile = () => {

    const {run} = useCloud();

    const profileDetailsMutation = useDataMutation({
        mutatedIdentity: profileQueriesIdentity.info,
        fn: updateProfileDetails
    })

    const buildProfileQuery = useDataQuery({
        identity: profileQueriesIdentity.infoWithSocialAccount(),
        fn: buildProfile
    })

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
            (res: SocialAccountTypeDTO[]) => res.map(socialAccountType => SocialAccountType.getFromDTO(socialAccountType))
        )
            .then(result => {
                if (result.isSuccess) return result.data
                return [];
            })
    }

    async function updateProfileDetails(user: ProfileDetails) {
        return run(
            cloudFunctionName.updateProfileDetails,
            {user: user.toDTO()},
            (result: ProfileDetailsDTO) => ProfileDetails.getFromDTO(result),
            true
        )
    }

    async function buildProfile() {
        return Promise.all([
            getProfileDetails(),
            getSocialAccountTypes()
        ])
            .then(result => {
                let profile = result[0];
                const socialAccountTypes = result[1];
                profile = buildProfileWithSocialAccounts(profile, socialAccountTypes);
                return {
                    socialAccountTypes: socialAccountTypes,
                    profileDetails: profile
                }
            })
    }

    function buildProfileWithSocialAccounts(profileInfo?: ProfileDetails, socialAccountTypes?: SocialAccountType[]) {
        if (profileInfo && socialAccountTypes) {
            const socialAccounts = socialAccountTypes.map(socialAccountType => {
                const socialAccount = profileInfo
                    ?.socialAccounts
                    ?.find(socialAccount => socialAccount.type === socialAccountType.key);
                if (socialAccount) return socialAccount;

                return ProfileSocialAccount.init(socialAccountType);
            })

            profileInfo.socialAccounts = socialAccounts;
        }

        return profileInfo;
    }

    return {
        updateProfileDetails: profileDetailsMutation.mutateAsync,
        profileDetails: buildProfileQuery.data?.profileDetails,
        socialAccountTypes: buildProfileQuery.data?.socialAccountTypes,
        isSubmitting: profileDetailsMutation.isLoading
    }
}

export default useProfile;