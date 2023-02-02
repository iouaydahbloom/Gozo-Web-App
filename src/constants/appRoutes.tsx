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
    cryptoTransactionHistoryData: '/transactionHistory/tokens/:name',
    cryptoTransactionHistoryDetails: '/transactionHistory/tokens/:name/:transactionId',
    authCallback: '/authCallback',
    spinner: '/spinner',
    reward: '/reward',
    buy: '/buy',
    buyGiftCard: '/buy/:id',
    getLoyaltyProgramTransactionHistoryDataRoute: (loyaltyCurrency: string) => {
        return `${AppRoutes.transactionHistory}/loyaltyPrograms/${loyaltyCurrency}`
    },
    getLoyaltyProgramTransactionHistoryDetailsRoute: (loyaltyCurrency: string, transactionId: string) => {
        return `${AppRoutes.transactionHistory}/loyaltyPrograms/${loyaltyCurrency}/${transactionId}`
    },
    getCryptoTransactionHistoryDataRoute: (name: string) => {
        return `${AppRoutes.transactionHistory}/tokens/${name}`
    },
    getCryptoTransactionHistoryDetailsRoute: (name: string, transactionId: string) => {
        return `${AppRoutes.transactionHistory}/tokens/${name}/${transactionId}`
    },
    getBuyGiftCardRoute: (id: string) => {
        return `${AppRoutes.buy}/${id}`
    }
}