import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ERC20Transfer } from "../models/assets/ERC20Transfer";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useCloud from "./useCloud";

const useERC20Transfers = () => {

  const { walletAddress, chainId } = useDapp();
  const { isInitialized } = useMoralis();
  const [eRC20Transfers, setERC20Transfers] = useState<ERC20Transfer[]>();
  const [isLoading, setIsLoading] = useState<boolean>()
  const { run } = useCloud();

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
    setIsLoading(true);
    return run(cloudFunctionName.getTokenTransfers, { address: walletAddress ?? '', chain: chainId as any })
      .then(result => {
        //@ts-ignore
        return result.isSuccess ? result.result : []
      })
      .finally(() => setIsLoading(false))
  }
  return {
    fetchERC20Transfers,
    eRC20Transfers,
    isLoadingTransfers: isLoading
  };
}

export default useERC20Transfers;
