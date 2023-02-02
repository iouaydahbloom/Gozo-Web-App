import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {useDapp} from "../../providers/DappProvider/DappProvider";
import useCloud from "../useCloud";
import {Pagination} from "../../models/data/pagination";
import {CryptoTransfer} from "../../models/assets/ERC20Transfer";
import {CryptoTransferDTO} from "../../dto/cryptoTransferDTO";


const useCryptoTransfers = () => {

    const {walletAddress} = useDapp();
    const {run} = useCloud();

    const getERC20Transfers = async (filters?: any) => {
        return run(
            cloudFunctionName.getTokenTransfers,
            filters ?? {address: walletAddress ?? ''},
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
    }

    const getNativeTransfers = async (filters?: any) => {
        return run(
            cloudFunctionName.getNativeTransfers,
            filters ?? {address: walletAddress ?? ''},
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
    }

    return {
        getERC20Transfers,
        getNativeTransfers
    }
}

export default useCryptoTransfers;
