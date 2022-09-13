import { useCallback, useEffect, useMemo, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { appConfig } from "../constants/appConfig";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { useDapp } from "../providers/DappProvider/DappProvider";

const useERC20Assets = (chain?: string) => {

  const { account } = useMoralisWeb3Api();
  const { isInitialized } = useMoralis();
  const { walletAddress, chainId, defaultTokenMetadata } = useDapp();
  const [assets, setAssets] = useState<ERC20Asset[]>();

  useEffect(() => {
    if (isInitialized) {
      fetchERC20Assets()
    }
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Assets = useCallback(async () => {
    if (!walletAddress) return [];

    return await account
      .getTokenBalances({
        address: walletAddress ?? '',
        chain: chain || chainId as any
      })
      .then((erc20Tokens) => {
        setAssets(erc20Tokens);
      })
      .catch((e) => {
        console.log(e.message);
        return [];
      })
  }, [walletAddress, chainId, chain])

  const defaultAsset = useMemo(() => {
    const defaultBalancedToken = assets ?
      assets.find(token => token.token_address.toLowerCase() == appConfig.tokenContract?.toLowerCase()) : null;
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

  return { fetchERC20Assets, assets, defaultAsset }
}

export default useERC20Assets;
