export const AppRoutes = {
    landing: '/landing',
    dashboard: '/dashboard',
    onBoarding: '/onboarding',
    home: '/home',
    account: '/account',
    transactionHistory: '/transactionHistory',
    authCallback: '/authCallback',
    // spinner: '/spinner',
    spinner: '/spinner/:id',
    reward: '/reward'
}

export const getSpinnerRoute = (id: string): string => (`/spinner/${id}`);