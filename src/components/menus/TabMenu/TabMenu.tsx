import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { gridOutline, personCircleOutline } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import Account from '../../../pages/Account/Account';
import Dashboard from '../../../pages/Dashboard/Dashboard';
import Landing from '../../../pages/Landing/Landing';
import OnBoarding from '../../../pages/OnBoarding/OnBoarding';
import TransactionHistory from '../../../pages/TransactionHistory/TransactionHistory';
import ProtectedRoute from '../../routes/ProtectedRoute/ProtectedRoute';
import PurePublicRoute from '../../routes/PurePublicRoute/PurePublicRoute';
import styles from './tabMenu.module.scss';

const TabMenu: React.FC = () => {
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
                <PurePublicRoute exact path={AppRoutes.landing}>
                    <Landing />
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

                <IonTabButton tab="account" href={AppRoutes.account}>
                    <IonIcon icon={personCircleOutline} />
                    <IonLabel>Account</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default TabMenu;