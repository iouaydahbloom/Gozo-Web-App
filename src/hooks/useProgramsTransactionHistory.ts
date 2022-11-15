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
    const [historyField, setHistoryField] = useState<LoyaltyMemberHistory>();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function getTransactions() {
        setIsLoading(true)
        return run(cloudFunctionName.transactionHistory,
            { ca_loyalty_currency: gozoLoyalty?.currency.loyaltyCurrency },
            (result: Pagination<LoyaltyMemberHistoryDTO>) => {
                return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
                    return LoyaltyMemberHistory.getFromDTO(res)
                }));
            },
            true)
            .then(result => {
                if (result.isSuccess) setHistoryFields(result.data.results);
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
        getTransaction,
        isLoadingHistory: isLoading,
        historyFields,
        historyField,
    }
}

export default useProgramsTransactionHistory