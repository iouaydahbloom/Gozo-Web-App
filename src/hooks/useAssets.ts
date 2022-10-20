import useERC20Assets from "./useERC20Assets";
import useLoyaltyProgramAssets from "./useLoyaltyPrograms";

const useAssets = () => {
    const { assets: erc20Assets, defaultAsset: defaultCryptoAsset } = useERC20Assets();
    const { defaultProgram, fetchMyLoyaltyPrograms, loadingMyLoyaltyPrograms } = useLoyaltyProgramAssets();

    return {
        cryptoAssets: erc20Assets,
        getUserLoyaltyPrograms: fetchMyLoyaltyPrograms,
        loadingMyLoyaltyPrograms: loadingMyLoyaltyPrograms,
        defaultCryptoAsset: defaultCryptoAsset,
        defaultLoyaltyAsset: defaultProgram
    }
}

export default useAssets;