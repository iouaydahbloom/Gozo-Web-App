import { useEffect, useMemo, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { appConfig } from "../constants/appConfig";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import useBlockchain from "./useBlockchain";

const useERC20Assets = (chain?: string) => {

  const { account } = useMoralisWeb3Api();
  const { isInitialized, isAuthenticated } = useBlockchain();
  const { walletAddress, chainId, defaultTokenMetadata } = useMoralisDapp();
  const [assets, setAssets] = useState<ERC20Asset[]>();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchERC20Assets()
    }
  }, [isInitialized, chainId, walletAddress]);

  const fetchERC20Assets = async () => {
    if (!isAuthenticated) return []
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
  }

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
