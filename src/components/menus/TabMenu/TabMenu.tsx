import { Deeplinks } from '@awesome-cordova-plugins/deeplinks';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { gridOutline, personCircleOutline } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { Redirect, Route, useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import Account from '../../../pages/Account/Account';
import AuthCallback from '../../../pages/Authentication/AuthCallback/AuthCallback';
import Dashboard from '../../../pages/Dashboard/Dashboard';
import Landing from '../../../pages/Landing/Landing';
import OnBoarding from '../../../pages/OnBoarding/OnBoarding';
import Spinner from '../../../pages/Spinner/Spinner';
import TransactionHistory from '../../../pages/TransactionHistory/TransactionHistory';
import SpinIcon from '../../icons/SpinIcon/SpinIcon';
import ProtectedRoute from '../../routes/ProtectedRoute/ProtectedRoute';
import PurePublicRoute from '../../routes/PurePublicRoute/PurePublicRoute';
import styles from './tabMenu.module.scss';

const TabMenu: React.FC = () => {

    const { push } = useHistory();

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
        <IonTabs>
            <IonRouterOutlet>
                <ProtectedRoute exact path={AppRoutes.dashboard}>
                    <Dashboard />
                </ProtectedRoute>
                <ProtectedRoute exact path={AppRoutes.onBoarding}>
                    <OnBoarding />
                </ProtectedRoute>
                <ProtectedRoute exact path={AppRoutes.account}>
                    <Account />
                </ProtectedRoute>
                <ProtectedRoute exact path={AppRoutes.transactionHistory}>
                    <TransactionHistory />
                </ProtectedRoute>
                <ProtectedRoute exact path={AppRoutes.spinner}>
                    <Spinner />
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

                <IonTabButton tab="spinner" href={AppRoutes.spinner}>
                    <SpinIcon />
                    <IonLabel>Spin</IonLabel>
                </IonTabButton>

                <IonTabButton tab="account" href={AppRoutes.account}>
                    <IonIcon icon={personCircleOutline} />
                    <IonLabel>Account</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default TabMenu;