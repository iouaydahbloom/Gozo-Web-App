import { useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useCloud from "./useCloud";
import { Pagination } from "../models/data/pagination";
import { CryptoTransfer } from "../models/assets/ERC20Transfer";
import { CryptoTransferDTO } from "../dto/cryptoTransferDTO";

const useCryptoTransfers = () => {

  const { walletAddress } = useDapp();
  const [isLoading, setIsLoading] = useState<boolean>()
  const { run } = useCloud();

  const getERC20Transfers = async (filters?: any) => {
    setIsLoading(true);
    return run(
      cloudFunctionName.getTokenTransfers,
      filters ?? { address: walletAddress ?? '' },
      (result: Pagination<CryptoTransferDTO>) => {
        return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
          return CryptoTransfer.getFromDTO(res)
        }));
      },
      true
    )
      .then(result => {
        return result.isSuccess ? result.data : []
      })
      .finally(() => setIsLoading(false))
  }

  const getNativeTransfers = async (filters?: any) => {
    setIsLoading(true);
    return run(
      cloudFunctionName.getNativeTransfers,
      filters ?? { address: walletAddress ?? '' },
      (result: Pagination<CryptoTransferDTO>) => {
        return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
          return CryptoTransfer.getFromDTO(res)
        }));
      },
      true
    )
      .then(result => {
        return result.isSuccess ? result.data : []
      })
      .finally(() => setIsLoading(false))
  }

  return {
    getERC20Transfers,
    getNativeTransfers,
    isLoadingTransfers: isLoading
  };
}

export default useCryptoTransfers;
