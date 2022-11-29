import { useCallback, useMemo, useState } from "react";
import { ERC20AssetDTO, NativeAssetDTO } from "../dto/cryptoDTO";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { NativeAsset } from "../models/assets/NativeAsset";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useCloud from "./useCloud";

const useCryptoAssets = () => {

  const { walletAddress, defaultTokenMetadata } = useDapp();
  const [assets, setAssets] = useState<(ERC20Asset | NativeAsset)[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const { tokenContractAddress } = useDapp();
  const { run } = useCloud();

  const fetchCryptoAssets = useCallback(async () => {
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
  }, [walletAddress])

  const fetchNativeAsset = useCallback(async () => {
    return run(
      cloudFunctionName.nativeCurrency,
      { address: walletAddress },
      (res: NativeAssetDTO) => NativeAsset.fromDto(res),
      true
    )
      .then(result => {
        return result.isSuccess ? result.data : null;
      })
  }, [walletAddress])

  const fetchERC20Assets = useCallback(async () => {
    return run(
      cloudFunctionName.tokenBalances,
      { address: walletAddress },
      (res: ERC20AssetDTO[]) => res.map(dto => ERC20Asset.fromDto(dto)),
      true
    )
      .then(result => {
        return result.isSuccess ? result.data : [];
      })
  }, [walletAddress])

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
    return assets.find(asset => asset instanceof NativeAsset) as NativeAsset | null
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
