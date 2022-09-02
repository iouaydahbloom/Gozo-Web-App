import { IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { calendar, informationCircle, map, personCircle } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';
import ProtectedRoute from '../../components/routes/ProtectedRoute/ProtectedRoute';
import { AppRoutes } from '../../constants/appRoutes';
import Dashboard from '../Dashboard/Dashboard';

const home: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <ProtectedRoute exact path={AppRoutes.dashboard}>
                    <Dashboard />
                </ProtectedRoute>
                <Route exact path="/">
                    <Redirect to={AppRoutes.dashboard} />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="dashboard" href={AppRoutes.dashboard}>
                    <IonIcon icon={calendar} />
                    <IonLabel>Schedule</IonLabel>
                    <IonBadge>6</IonBadge>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default home