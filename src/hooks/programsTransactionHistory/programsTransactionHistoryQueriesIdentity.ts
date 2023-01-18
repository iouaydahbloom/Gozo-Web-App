import {Filter} from "../../models/data/filter";

const programsTransactionHistoryQueriesIdentity = {
    info: (transactionId: string) => ['transactionItem', transactionId] as const,
    list: (filter?: Filter, loyaltyCurrency?: string) => ['transactionHistory', filter, loyaltyCurrency] as const
}

export {
    programsTransactionHistoryQueriesIdentity
}