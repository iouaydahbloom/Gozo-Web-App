export const AppRoutes = {
    landing: '/landing',
    dashboard: '/dashboard',
    onBoarding: '/onboarding',
    home: '/home',
    account: '/account',
    profile: '/profile',
    transactionHistory: '/transactionHistory',
    loyaltyProgramTransactionHistoryData: '/transactionHistory/loyaltyPrograms/:loyaltyCurrency',
    loyaltyProgramTransactionHistoryDetails: '/transactionHistory/loyaltyPrograms/:loyaltyCurrency/:transactionId',
    tokenHistoryDetails: '/transactionHistory/tokenDetails',
    authCallback: '/authCallback',
    spinner: '/spinner',
    reward: '/reward',
    buy: '/buy',
    giftCard: '/giftCard',
    getLoyaltyProgramTransactionHistoryDataRoute: (loyaltyCurrency: string) => {
        return `${AppRoutes.transactionHistory}/loyaltyPrograms/${loyaltyCurrency}`
    },
    getLoyaltyProgramTransactionHistoryDetailsRoute: (loyaltyCurrency: string, transactionId: string) => {
        return `${AppRoutes.transactionHistory}/loyaltyPrograms/${loyaltyCurrency}/${transactionId}`
    }
}