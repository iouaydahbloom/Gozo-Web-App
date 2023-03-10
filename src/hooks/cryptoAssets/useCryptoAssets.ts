import {useCallback, useMemo} from "react";
import {ERC20AssetDTO, NativeAssetDTO} from "../../dto/cryptoDTO";
import {ERC20Asset} from "../../models/assets/ERC20Asset";
import {NativeAsset} from "../../models/assets/NativeAsset";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {useDapp} from "../../providers/DappProvider/DappProvider";
import useCloud from "../useCloud";
import useAuthentication from "../useAuthentication";
import useDataQuery from "../queryCaching/useDataQuery";
import {cryptoAssetsQueriesIdentity} from "./cryptoAssetsQueriesIdentity";

const useCryptoAssets = () => {

    const {defaultTokenMetadata, defaultNativeMetada} = useDapp();
    const {tokenContractAddress} = useDapp();
    const {run} = useCloud();
    const {user} = useAuthentication();

    const cryptoAssetsQuery = useDataQuery({
        identity: cryptoAssetsQueriesIdentity.list,
        fn: () => fetchCryptoAssets(),
        enabled: !!user?.walletAddress
    })

    const fetchCryptoAssets = useCallback(async () => {
        if (!user?.walletAddress) return Promise.resolve([]);
        //setIsLoadingAssets(true);
        return Promise.all([
            fetchNativeAsset(),
            fetchERC20Assets()
        ])
            .then(result => {
                const nativeAsset = result[0];
                const erc20Assets = result[1];
                const assets: (ERC20Asset | NativeAsset)[] = nativeAsset ? [nativeAsset, ...erc20Assets] : [...erc20Assets];
                return assets;
            })
    }, [user?.walletAddress])

    const fetchNativeAsset = async () => {
        return run(
            cloudFunctionName.nativeCurrency,
            {address: user?.walletAddress},
            (res: NativeAssetDTO) => NativeAsset.fromDto(res),
            true
        )
            .then(result => {
                return result.isSuccess ? result.data : null;
            })
    }

    const fetchERC20Assets = async () => {
        return run(
            cloudFunctionName.tokenBalances,
            {address: user?.walletAddress},
            (res: ERC20AssetDTO[]) => res.map(dto => ERC20Asset.fromDto(dto)),
            true
        )
            .then(result => {
                return result.isSuccess ? result.data : [];
            })
    }

    const defaultERC20Asset = useMemo(() => {
        const defaultBalancedAsset = cryptoAssetsQuery.data ?
            cryptoAssetsQuery.data
                .find(
                    asset =>
                        asset instanceof ERC20Asset &&
                        asset.tokenAddress.toLowerCase() === tokenContractAddress?.toLowerCase()
                ) as ERC20Asset
            : null;

        if (defaultBalancedAsset) {
            return defaultBalancedAsset;
        }

        return defaultTokenMetadata ?
            new ERC20Asset(defaultTokenMetadata.address,
                defaultTokenMetadata.name,
                defaultTokenMetadata.symbol,
                defaultTokenMetadata.decimals,
                '0',
                defaultTokenMetadata.logo,
                defaultTokenMetadata.thumbnail) : null;
    }, [defaultTokenMetadata, cryptoAssetsQuery.data])

    const defaultNativeAsset = useMemo(() => {
        const defaultBalancedNative = cryptoAssetsQuery.data ?
            cryptoAssetsQuery.data.find(asset => asset instanceof NativeAsset) as NativeAsset | null :
            null;

        if (defaultBalancedNative) {
            return defaultBalancedNative;
        }

        return defaultNativeMetada ?
            new NativeAsset(
                defaultNativeMetada.name,
                defaultNativeMetada.symbol,
                defaultNativeMetada.decimals,
                defaultNativeMetada.balance,
                defaultNativeMetada.logo,
                defaultNativeMetada.thumbnail,
            ) :
            null;
    }, [cryptoAssetsQuery.data])

    return {
        fetchCryptoAssets: cryptoAssetsQuery.refetch,
        assets: cryptoAssetsQuery.data,
        defaultERC20Asset,
        defaultNativeAsset,
        isLoadingAssets: cryptoAssetsQuery.isLoading
    }
}

export default useCryptoAssets;
