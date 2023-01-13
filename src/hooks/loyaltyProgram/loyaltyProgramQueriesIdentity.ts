const loyaltyProgramQueriesIdentity = {
    defaultCurrency: ['defaultCurrency'] as const,
    filteredProgram: (programId: string, exchangeType: string) => ['filteredProgram', programId, exchangeType] as const,
    program: (programId: string) => ['program', programId] as const,
    userPrograms: ['userPrograms'] as const
}

export {
    loyaltyProgramQueriesIdentity
}