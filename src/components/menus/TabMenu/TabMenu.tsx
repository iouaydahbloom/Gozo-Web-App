import { Deeplinks } from '@awesome-cordova-plugins/deeplinks';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { gridOutline, personCircleOutline, walletOutline } from 'ionicons/icons';
import React, { useEffect, useRef } from 'react';
import { Redirect, Route, useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
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
import OnBoardingRoute from '../../routes/OnBoardingRoute/OnBoardingRoute';
import ProtectedRoute from '../../routes/ProtectedRoute/ProtectedRoute';
import PurePublicRoute from '../../routes/PurePublicRoute/PurePublicRoute';
import styles from './tabMenu.module.scss';

const TabMenu: React.FC = () => {

    const { push } = useHistory();
    const spinnerBtnRef = useRef<any>(null);

    useEffect(() => {
        const deeplinkSubscription = Deeplinks.route({
            '/landing': Landing,
            '/authCallback': AuthCallback
        }).subscribe(match => {
            push({ pathname: match.$link.path, search: match.$link.queryString })
        }, nomatch => {
            console.error('Got a deeplink that didn\'t match', nomatch);
        })

        return () => {
            deeplinkSubscription.unsubscribe();
        }
    }, [])

    return (
        <>
            <IonTabs className={styles.tabsBar}>
                <IonRouterOutlet>
                    <ProtectedRoute exact path={AppRoutes.dashboard}>
                        <Dashboard />
                    </ProtectedRoute>
                    <ProtectedRoute exact path={AppRoutes.onBoarding}>
                        <OnBoardingRoute>
                            <OnBoarding />
                        </OnBoardingRoute>
                    </ProtectedRoute>
                    <ProtectedRoute exact path={AppRoutes.account}>
                        <Account />
                    </ProtectedRoute>
                    <ProtectedRoute exact path={AppRoutes.transactionHistory}>
                        <TransactionHistory />
                    </ProtectedRoute>
                    <ProtectedRoute exact path={AppRoutes.reward}>
                        <Rewards />
                    </ProtectedRoute>
                    <ProtectedRoute exact path={AppRoutes.spinner}>
                        <Spinner />
                    </ProtectedRoute>
                    <ProtectedRoute exact path={AppRoutes.buy}>
                        <Buy />
                    </ProtectedRoute>
                    <PurePublicRoute exact path={AppRoutes.landing}>
                        <Landing />
                    </PurePublicRoute>
                    <PurePublicRoute exact path={AppRoutes.authCallback}>
                        <AuthCallback />
                    </PurePublicRoute>
                    <Route exact path="/">
                        <Redirect to={AppRoutes.landing} />
                    </Route>
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
            <div
                id='fab-button'
                className={styles.floatingButton}
                onClick={() => spinnerBtnRef.current.handleIonTabButtonClick()}>
                <SpinIcon size='large' />
            </div>
        </>
    )
}

export default TabMenu;