const membershipQueriesIdentity = {
    info: (loyaltyCurrency?: string) => ['membership', loyaltyCurrency] as const
}

export {
    membershipQueriesIdentity
}