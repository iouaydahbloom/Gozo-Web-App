import { useEffect, useState } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

const useERC20Transfers = () => {
  const { account } = useMoralisWeb3Api();
  const { walletAddress, chainId } = useMoralisDapp();
  const { isInitialized } = useMoralis();
  const [ERC20Transfers, setERC20Transfers] = useState();

  useEffect(() => {
    if (isInitialized)
      fetchERC20Transfers()
        .then((balance) => setERC20Transfers(balance))
        .catch((e) => console.log(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, walletAddress]);

  const fetchERC20Transfers = async () => {
    return await account
      .getTokenTransfers({ address: walletAddress ?? '', chain: chainId as any })
      .then((result: any) => result.result)
      .catch((e) => console.log(e.message));
  };
  return { fetchERC20Transfers, ERC20Transfers };
}

export default useERC20Transfers;
