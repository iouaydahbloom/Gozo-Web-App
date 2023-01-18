import {Filter} from "../../models/data/filter";

const giftCardQueriesIdentity = {
    info: (id: string) => ['giftCard', id] as const,
    list: (filter: Filter) => ['giftCards', filter] as const
}

export {
    giftCardQueriesIdentity
}