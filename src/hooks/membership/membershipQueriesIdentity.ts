const membershipQueriesIdentity = {
    all: ['membership'] as const,
    info: (loyaltyCurrency?: string) => [...membershipQueriesIdentity.all, loyaltyCurrency] as const
}

export {
    membershipQueriesIdentity
}