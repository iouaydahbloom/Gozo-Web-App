import {LoyaltyMemberHistoryDTO} from "../../dto/loyaltyMemberDTO";
import {Filter} from "../../models/data/filter";
import {Pagination} from "../../models/data/pagination";
import {LoyaltyMemberHistory} from "../../models/loyaltyMember";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import useCloud from "../useCloud";
import useDataQuery from "../queryCaching/useDataQuery";
import {programsTransactionHistoryQueriesIdentity} from "./programsTransactionHistoryQueriesIdentity";

interface Props {
    transactionId?: string
}

const useProgramsTransactionHistory = ({transactionId}: Props) => {

    const {run} = useCloud();

    const transactionQuery = useDataQuery({
        identity: programsTransactionHistoryQueriesIdentity.info(transactionId!),
        fn: () => getTransaction(transactionId!),
        enabled: !!transactionId
    })

    async function getTransactions(filter: Filter, loyaltyCurrency: string) {
        return run(cloudFunctionName.transactionHistory,
            {...filter, ca_loyalty_currency: loyaltyCurrency},
            (result: Pagination<LoyaltyMemberHistoryDTO>) => {
                return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
                    return LoyaltyMemberHistory.getFromDTO(res)
                }));
            },
            true)
            .then(result => {
                return result.isSuccess ? result.data : null
            })
    }

    async function getTransaction(transactionId: string) {
        return run(cloudFunctionName.transactionDetails,
            {transaction_id: transactionId},
            (result: LoyaltyMemberHistoryDTO) => {
                return LoyaltyMemberHistory.getFromDTO(result)
            }
            ,
            true)
            .then(result => {
                if (result.isSuccess) return result.data;
            })
    }

    return {
        getTransactions,
        getTransaction: transactionQuery.refetch,
        isLoadingHistory: transactionQuery.isLoading,
        historyField: transactionQuery.data
    }
}

export default useProgramsTransactionHistory