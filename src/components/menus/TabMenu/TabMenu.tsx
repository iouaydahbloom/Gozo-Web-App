// import { Deeplinks } from '@awesome-cordova-plugins/deeplinks';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, useIonRouter } from '@ionic/react';
import { gridOutline, personCircleOutline, walletOutline } from 'ionicons/icons';
import React, { useEffect, useMemo, useRef } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import useAuthentication from '../../../hooks/useAuthentication';
import useOnBoardingPreview from '../../../hooks/useOnBoardingPreview';
import Account from '../../../pages/Account/Account';
import AuthCallback from '../../../pages/Authentication/AuthCallback/AuthCallback';
import Buy from '../../../pages/Buy/Buy';
import Dashboard from '../../../pages/Dashboard/Dashboard';
import Landing from '../../../pages/Landing/Landing';
import OnBoarding from '../../../pages/OnBoarding/OnBoarding';
import Rewards from '../../../pages/Reward/Reward';
import Spinner from '../../../pages/Spinner/Spinner';
import TransactionHistory from '../../../pages/TransactionHistory/TransactionHistory';
import RewardIcon from '../../icons/RewardIcon/RewardIcon';
import SpinIcon from '../../icons/SpinIcon/SpinIcon';
import styles from './tabMenu.module.scss';

const TabMenu: React.FC = () => {

    const { push } = useIonRouter();
    const spinnerBtnRef = useRef<any>(null);
    const { isAuthenticated } = useAuthentication();
    const { isHidden: isOnboardingHidden } = useOnBoardingPreview();
    const { pathname } = useLocation();

    // useEffect(() => {
    //     const deeplinkSubscription = Deeplinks.route({
    //         '/landing': Landing,
    //         '/authCallback': AuthCallback
    //     }).subscribe(match => {
    //         push({ pathname: match.$link.path, search: match.$link.queryString })
    //     }, nomatch => {
    //         console.error('Got a deeplink that didn\'t match', nomatch);
    //     })

    //     return () => {
    //         deeplinkSubscription.unsubscribe();
    //     }
    // }, [])

    function handleRoutesProtections() {
        if (pathname == AppRoutes.landing && isAuthenticated && isOnboardingHidden) {
            setTimeout(() => {
                push(AppRoutes.dashboard)
            }, 1000);
        }
        else if (pathname == AppRoutes.landing && isAuthenticated) {
            setTimeout(() => {
                push(AppRoutes.onBoarding)
            }, 1000);
        }
        else if (pathname !== AppRoutes.landing && !isAuthenticated) {
            setTimeout(() => {
                push(AppRoutes.landing)
            }, 1000);
        }
    }

    useEffect(() => {
        handleRoutesProtections();
    }, [isAuthenticated, isOnboardingHidden, pathname])

    const playButton = useMemo(() => (
        <div
            id='fab-button'
            className={styles.floatingButton}
            onClick={() => spinnerBtnRef.current.handleIonTabButtonClick()}>
            <SpinIcon size='large' />
        </div>
    ), [spinnerBtnRef])

    const tabRoutes = useMemo(() => (
        <>
            <IonTabs className={styles.tabsBar}>
                <IonRouterOutlet>
                    <Route exact path={AppRoutes.dashboard}>
                        <Dashboard />
                    </Route>
                    <Route exact path={AppRoutes.onBoarding}>
                        <OnBoarding />
                    </Route>
                    <Route exact path={AppRoutes.account}>
                        <Account />
                    </Route>
                    <Route exact path={AppRoutes.transactionHistory}>
                        <TransactionHistory />
                    </Route>
                    <Route exact path={AppRoutes.reward}>
                        <Rewards />
                    </Route>
                    <Route exact path={AppRoutes.spinner}>
                        <Spinner />
                    </Route>
                    <Route exact path={AppRoutes.buy}>
                        <Buy />
                    </Route>
                    <Route exact path={AppRoutes.landing}>
                        <Landing />
                    </Route>
                    <Route exact path={AppRoutes.authCallback}>
                        <AuthCallback />
                    </Route>
                    <Redirect exact from='/' to={AppRoutes.landing} />
                </IonRouterOutlet>
                <IonTabBar
                    id='app-tab-bar'
                    slot="bottom"
                    className={styles.tabBar}>
                    <IonTabButton tab="dashboard" href={AppRoutes.dashboard}>
                        <IonIcon icon={gridOutline} />
                        <IonLabel>Dashboard</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="reward" href={AppRoutes.reward}>
                        <RewardIcon />
                        <IonLabel>Rewards</IonLabel>
                    </IonTabButton>

                    <IonTabButton ref={spinnerBtnRef} tab="spinner" href={AppRoutes.spinner}>
                        <IonLabel style={{ marginBottom: '-25px' }}>Play</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="buy" href={AppRoutes.buy}>
                        <IonIcon icon={walletOutline} />
                        <IonLabel>Buy</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="account" href={AppRoutes.account}>
                        <IonIcon icon={personCircleOutline} />
                        <IonLabel>Account</IonLabel>
                    </IonTabButton>
                </IonTabBar>

            </IonTabs>
            {playButton}
        </>
    ), [])

    return (
        <>{tabRoutes}</>
    )
}

export default TabMenu;