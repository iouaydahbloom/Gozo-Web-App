const currencyConversionQueriesIdentity = {
    simulateFiatToDefaultPointsConversion: (fiat: string, amount: string) => ['simulateFiatToDefaultPointsConversion', fiat, amount] as const
}

export {
    currencyConversionQueriesIdentity
}