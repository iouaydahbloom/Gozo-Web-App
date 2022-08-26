import useERC20Assets from "./useERC20Assets";
import useLoyaltyProgramAssets from "./useLoyaltyPrograms";

const useAssets = () => {
    const { assets: erc20Assets, defaultAsset: defaultCryptoAsset } = useERC20Assets();
    const { defaultProgram, fetchMyLoyaltyPrograms } = useLoyaltyProgramAssets();

    return {
        cryptoAssets: erc20Assets,
        getUserLoyaltyPrograms: fetchMyLoyaltyPrograms,
        defaultCryptoAsset: defaultCryptoAsset,
        defaultLoyaltyAsset: defaultProgram
    }
}

export default useAssets;