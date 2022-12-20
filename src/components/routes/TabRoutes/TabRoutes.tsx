import { IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonRouter } from '@ionic/react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import useAppAnalytics from '../../../hooks/useAppAnalytics';
import useAuthentication from '../../../hooks/useAuthentication';
import useNetwork from '../../../hooks/useNetwork';
import useOnBoardingPreview from '../../../hooks/useOnBoardingPreview';
import Account from '../../../pages/Account/Account';
import AuthCallback from '../../../pages/Authentication/AuthCallback/AuthCallback';
import Buy from '../../../pages/Buy/Buy';
import Dashboard from '../../../pages/Dashboard/Dashboard';
import GiftCardDetails from '../../../pages/Buy/GiftCardDetails/GiftCardDetails';
import Landing from '../../../pages/Landing/Landing';
import LoyaltyProgramHistoryDetails from '../../../pages/LoyaltyProgramHistoryDetails/LoyaltyProgramHistoryDetails';
import OnBoarding from '../../../pages/OnBoarding/OnBoarding';
import Profile from '../../../pages/Profile/Profile';
import Rewards from '../../../pages/Reward/Reward';
import Spinner from '../../../pages/Spinner/Spinner';
import TokenHistoryDetails from '../../../pages/TokenHistoryDetails/TokenHistoryDetails';
import TransactionHistory from '../../../pages/TransactionHistory/TransactionHistory';
import TabHeaderHeightProvider from '../../../providers/TabHeaderHeightProvider/TabHeaderHeightProvider';
import AccountIcon from '../../icons/AccountIcon/AccountIcon';
import BuyIcon from '../../icons/BuyIcon/BuyIcon';
import DashboardIcon from '../../icons/DashboardIcon/DashboardIcon';
import RewardIcon from '../../icons/RewardIcon/RewardIcon';
import SpinIcon from '../../icons/SpinIcon/SpinIcon';
import styles from './tabRoutes.module.scss';
import LoyaltyPogramHistoryData from '../../../pages/LoyaltyProgramHistoryData/LoyaltyProgramHistoryData';

const TabRoutes: React.FC = () => {

    const { push } = useIonRouter();
    const spinnerBtnRef = useRef<any>(null);
    const { isAuthenticated } = useAuthentication();
    const { isHidden: isOnboardingHidden } = useOnBoardingPreview();
    const { pathname } = useLocation();
    useNetwork();
    useAppAnalytics();

    const handleRoutesProtections = useCallback(() => {
        if (pathname === AppRoutes.landing && isAuthenticated && isOnboardingHidden) {
            setTimeout(() => {
                push(AppRoutes.dashboard)
            }, 1000);
        }
        else if (pathname === AppRoutes.landing && isAuthenticated) {
            setTimeout(() => {
                push(AppRoutes.onBoarding)
            }, 1000);
        }
        else if (pathname !== AppRoutes.landing && !isAuthenticated) {
            setTimeout(() => {
                push(AppRoutes.landing)
            }, 1000);
        }
    }, [pathname, isAuthenticated, isOnboardingHidden])

    useEffect(() => {
        handleRoutesProtections();
    }, [isAuthenticated, isOnboardingHidden, pathname])

    const playButton = useMemo(() => (
        <div
            id='fab-button'
            className={styles.floatingButton}
            onClick={() => spinnerBtnRef.current.handleIonTabButtonClick()}>
            <SpinIcon size='large' isFilled={pathname === AppRoutes.spinner} />
        </div>
    ), [spinnerBtnRef, pathname])

    const routes = useMemo(() => (
        <IonRouterOutlet>
            <Route exact path={AppRoutes.dashboard}>
                <TabHeaderHeightProvider>
                    <Dashboard />
                </TabHeaderHeightProvider>
            </Route>
            <Route exact path={AppRoutes.onBoarding}>
                <OnBoarding />
            </Route>
            <Route exact path={AppRoutes.account}>
                <Account />
            </Route>
            <Route exact path={AppRoutes.profile}>
                <Profile />
            </Route>
            <Route exact path={AppRoutes.transactionHistory}>
                <TabHeaderHeightProvider>
                    <TransactionHistory />
                </TabHeaderHeightProvider>
            </Route>
            <Route exact path={AppRoutes.loyaltyProgramTransactionHistoryData}>
                <LoyaltyPogramHistoryData />
            </Route>
            <Route exact path={AppRoutes.loyaltyProgramTransactionHistoryDetails}>
                <LoyaltyProgramHistoryDetails />
            </Route>
            <Route exact path={AppRoutes.tokenHistoryDetails}>
                <TokenHistoryDetails />
            </Route>
            <Route exact path={AppRoutes.reward}>
                <TabHeaderHeightProvider>
                    <Rewards />
                </TabHeaderHeightProvider>
            </Route>
            <Route exact path={AppRoutes.spinner}>
                <Spinner />
            </Route>
            <Route exact path={AppRoutes.buy}>
                <Buy />
            </Route>
            <Route exact path={AppRoutes.giftCard}>
                <GiftCardDetails />
            </Route>
            <Route exact path={AppRoutes.landing}>
                <Landing />
            </Route>
            <Route exact path={AppRoutes.authCallback}>
                <AuthCallback />
            </Route>
            <Redirect exact from='/' to={AppRoutes.landing} />
        </IonRouterOutlet>
    ), [])

    const tabRoutes = useMemo(() => (
        <>
            <IonTabs className={styles.tabsBar}>
                {routes}
                <IonTabBar
                    id='app-tab-bar'
                    slot="bottom"
                    className={styles.tabBar}>
                    <IonTabButton tab="dashboard" href={AppRoutes.dashboard}>
                        <DashboardIcon isFilled={pathname === AppRoutes.dashboard} />
                        <IonLabel>Dashboard</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="reward" href={AppRoutes.reward}>
                        <RewardIcon isFilled={pathname === AppRoutes.reward} />
                        <IonLabel>Rewards</IonLabel>
                    </IonTabButton>

                    <IonTabButton ref={spinnerBtnRef} tab="spinner" href={AppRoutes.spinner}>
                        <IonLabel style={{ marginBottom: '-33px' }}>Play</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="buy" href={AppRoutes.buy}>
                        <BuyIcon isFilled={pathname === AppRoutes.buy} />
                        <IonLabel>Buy</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="account" href={AppRoutes.account}>
                        <AccountIcon isFilled={pathname === AppRoutes.account} />
                        <IonLabel>Account</IonLabel>
                    </IonTabButton>
                </IonTabBar>

            </IonTabs>
            {playButton}
        </>
    ), [pathname])

    return (
        <>
            {tabRoutes}
        </>
    )
}

export default TabRoutes;