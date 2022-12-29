import { useCallback, useMemo, useState } from "react";
import { ERC20AssetDTO, NativeAssetDTO } from "../dto/cryptoDTO";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { NativeAsset } from "../models/assets/NativeAsset";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useCloud from "./useCloud";
import useAuthentication from "./useAuthentication";

const useCryptoAssets = () => {

  const { defaultTokenMetadata, defaultNativeMetada } = useDapp();
  const [assets, setAssets] = useState<(ERC20Asset | NativeAsset)[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const { tokenContractAddress } = useDapp();
  const { run } = useCloud();
  const { user } = useAuthentication();

  const fetchCryptoAssets = useCallback(async () => {
    if (!user?.walletAddress) return Promise.resolve([]);

    setIsLoadingAssets(true);
    return Promise.all([
      fetchNativeAsset(),
      fetchERC20Assets()
    ])
      .then(result => {
        const nativeAsset = result[0];
        const erc20Assets = result[1];
        const assets: (ERC20Asset | NativeAsset)[] = nativeAsset ? [nativeAsset, ...erc20Assets] : [...erc20Assets];
        setAssets(assets);
        return assets;
      })
      .finally(() => setIsLoadingAssets(false))
  }, [user?.walletAddress])

  const fetchNativeAsset = async () => {
    return run(
      cloudFunctionName.nativeCurrency,
      { address: user?.walletAddress },
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
      { address: user?.walletAddress },
      (res: ERC20AssetDTO[]) => res.map(dto => ERC20Asset.fromDto(dto)),
      true
    )
      .then(result => {
        return result.isSuccess ? result.data : [];
      })
  }

  const defaultERC20Asset = useMemo(() => {
    const defaultBalancedAsset = assets ?
      assets
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
  }, [defaultTokenMetadata, assets])

  const defaultNativeAsset = useMemo(() => {
    const defaultBalancedNative = assets ?
      assets.find(asset => asset instanceof NativeAsset) as NativeAsset | null :
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
  }, [assets])

  return {
    fetchCryptoAssets,
    assets,
    defaultERC20Asset,
    defaultNativeAsset,
    isLoadingAssets
  }
}

export default useCryptoAssets;
