import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { ERC20Transfer } from "../models/assets/ERC20Transfer";
import { useDapp } from "../providers/DappProvider/DappProvider";

const useERC20Transfers = () => {
  const { account } = useMoralisWeb3Api();
  const { walletAddress, chainId } = useDapp();
  const { isInitialized } = useMoralis();
  const [eRC20Transfers, setERC20Transfers] = useState<ERC20Transfer[]>();
  const [isLoading, setIsLoading] = useState<boolean>()

  useEffect(() => {
    if (isInitialized)
      fetchERC20Transfers()
        .then((balance) => {
          if (balance) setERC20Transfers(balance)
        })
        .catch((e) => console.log(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, walletAddress]);

  const fetchERC20Transfers = async () => {
    setIsLoading(true)
    return await account
      .getTokenTransfers({ address: walletAddress ?? '', chain: chainId as any })
      .then((result) => result.result)
      .catch((e) => console.log(e.message))
      .finally(()=> setIsLoading(false))
  }
  return { 
    fetchERC20Transfers, 
    eRC20Transfers,
    isLoadingTransfers: isLoading
   };
}

export default useERC20Transfers;
