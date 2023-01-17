import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {useDapp} from "../../providers/DappProvider/DappProvider";
import useCloud from "../useCloud";
import {Pagination} from "../../models/data/pagination";
import {CryptoTransfer} from "../../models/assets/ERC20Transfer";
import {CryptoTransferDTO} from "../../dto/cryptoTransferDTO";
import useDataQuery from "../queryCaching/useDataQuery";
import {cryptoTransfersQueriesIdentity} from "./cryptoTransfersQueriesIdentity";

interface Props {
    erc20TransfersFilters?: any,
    nativeTransfersFilters?: any
}

const useCryptoTransfers = ({erc20TransfersFilters, nativeTransfersFilters}: Props) => {

    const {walletAddress} = useDapp();
    const {run} = useCloud();

    const erc20TransfersQuery = useDataQuery({
        identity: cryptoTransfersQueriesIdentity.erc20List,
        fn: () => getERC20Transfers(erc20TransfersFilters)
    })

    const nativeTransfersQuery = useDataQuery({
        identity: cryptoTransfersQueriesIdentity.nativeList,
        fn: () => getERC20Transfers(nativeTransfersFilters)
    })

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
        getNativeTransfers,
        isLoadingTransfers: erc20TransfersQuery.isLoading || nativeTransfersQuery.isLoading
    }
}

export default useCryptoTransfers;
