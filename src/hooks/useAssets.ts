import useCryptoAssets from "./useCryptoAssets";
import useLoyaltyProgramAssets from "./useLoyaltyPrograms";

const useAssets = () => {
    const { assets: erc20Assets, defaultERC20Asset: defaultCryptoAsset } = useCryptoAssets();
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