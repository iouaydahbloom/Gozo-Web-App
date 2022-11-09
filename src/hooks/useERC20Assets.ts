import { useCallback, useEffect, useMemo, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { useDapp } from "../providers/DappProvider/DappProvider";

const useERC20Assets = (chain?: string) => {

  const { account } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const { walletAddress, chainId, defaultTokenMetadata } = useDapp();
  const [assets, setAssets] = useState<ERC20Asset[]>();
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const { tokenContractAddress } = useDapp();

  useEffect(() => {
    if (isInitialized) {
      fetchERC20Assets()
    }
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Assets = useCallback(async () => {
    if (!walletAddress) return [] as ERC20Asset[];
    setIsLoadingAssets(true);

    return await account
      .getTokenBalances({
        address: walletAddress ?? '',
        chain: chain || chainId as any
      })
      .then((erc20Tokens: any) => {
        setAssets(erc20Tokens);
        return erc20Tokens;
      })
      .catch((e) => {
        console.log(e.message);
        return [];
      })
      .finally(() => setIsLoadingAssets(false))
  }, [walletAddress, chainId, chain])

  const defaultAsset = useMemo(() => {
    const defaultBalancedToken = assets ?
      assets.find(token => token.token_address.toLowerCase() == tokenContractAddress?.toLowerCase()) : null;
    if (defaultBalancedToken) {
      return defaultBalancedToken;
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

  return {
    fetchERC20Assets,
    assets,
    defaultAsset,
    isLoadingAssets
  }
}

export default useERC20Assets;
