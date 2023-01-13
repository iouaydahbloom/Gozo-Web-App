const prizeQueriesIdentity = {
    loyaltyCurrency: (loyaltyCurrency?: string) => ['prizes', loyaltyCurrency] as const,
    info: (prizeId?: string) => ['prize', prizeId] as const,
}

export {
    prizeQueriesIdentity
}