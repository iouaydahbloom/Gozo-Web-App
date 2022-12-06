import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ERC20Transfer } from "../models/assets/ERC20Transfer";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useCloud from "./useCloud";

const useERC20Transfers = () => {

  const { walletAddress } = useDapp();
  const { isInitialized } = useMoralis();
  const [eRC20Transfers, setERC20Transfers] = useState<ERC20Transfer[]>();
  const [isLoading, setIsLoading] = useState<boolean>()
  const { run } = useCloud();

  const getERC20Transfers = async () => {
    setIsLoading(true);
    return run(
      cloudFunctionName.getTokenTransfers,
      { address: walletAddress ?? '' },
      (res: ERC20Transfer[]) => res,
      true
    )
      .then(result => {
        return result.isSuccess ? result.data : []
      })
      .finally(() => setIsLoading(false))
  }

  function fetchERC20Transfers() {
    if (isInitialized)
      getERC20Transfers()
        .then((balance) => {
          if (balance) setERC20Transfers(balance)
        })
        .catch((e) => console.log(e.message));
  }

  return {
    fetchERC20Transfers,
    eRC20Transfers,
    isLoadingTransfers: isLoading
  };
}

export default useERC20Transfers;
