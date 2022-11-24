import { useContext, useEffect, useState } from "react";
import { LoyaltyMemberHistoryDTO } from "../dto/loyaltyMemberDTO";
import { Pagination } from "../models/data/pagination";
import { LoyaltyMemberHistory } from "../models/loyaltyMember";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { currencySettingsContext } from "../providers/CurrencySettingsProvider/currencySettingsContext";
import useCloud from "./useCloud";

const useProgramsTransactionHistory = (transaction_id?: string) => {
    const { run } = useCloud();
    const { gozoLoyalty } = useContext(currencySettingsContext);
    const [historyFields, setHistoryFields] = useState<LoyaltyMemberHistory[]>([]);
    const [ pagination, setPagination ] = useState<Pagination<LoyaltyMemberHistory>>()
    const [historyField, setHistoryField] = useState<LoyaltyMemberHistory>();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function getTransactions() {
        if(!pagination?.next) setIsLoading(true)
        return run(`${cloudFunctionName.transactionHistory}${pagination?.next ? pagination?.next : ''}`,
            { ca_loyalty_currency: gozoLoyalty?.currency.loyaltyCurrency },
            (result: Pagination<LoyaltyMemberHistoryDTO>) => {
                return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
                    return LoyaltyMemberHistory.getFromDTO(res)
                }));
            },
            true)
            .then(result => {
                if (result.isSuccess) {
                    setPagination(result.data)
                    var historyFieldsRef = [...historyFields]
                    const historyFieldsList = historyFieldsRef.concat(result.data.results)
                    setHistoryFields(historyFieldsList);
                }
            })
            .finally(() => setIsLoading(false))
    }

    async function getTransaction() {
        setIsLoading(true)
        return run(cloudFunctionName.transactionDetails,
            { transaction_id: transaction_id },
            (result: LoyaltyMemberHistoryDTO) => {
                return LoyaltyMemberHistory.getFromDTO(result)
            }
            ,
            true)
            .then(result => {
                if (result.isSuccess) setHistoryField(result.data);
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if(transaction_id) getTransaction()
    }, [transaction_id])

    return {
        getTransactions,
        transactionCount: pagination?.count,
        getTransaction,
        isLoadingHistory: isLoading,
        historyFields,
        historyField,
    }
}

export default useProgramsTransactionHistory