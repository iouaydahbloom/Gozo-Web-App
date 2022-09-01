import { IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { calendar, informationCircle, map, personCircle } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';
import Dashboard from '../Dashboard/Dashboard';
import Swap from '../Swap/Swap';

const home: React.FC = () => {
    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route path="/dashboard" component={Dashboard} exact={true} />
                <Route path="/swap" component={Swap} exact={true} />
                <Route path="/" render={() => <Redirect to="/dashboard" />} exact={true} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="dashboard" href='/dashboard'>
                    <IonIcon icon={calendar} />
                    <IonLabel>Schedule</IonLabel>
                    <IonBadge>6</IonBadge>
                </IonTabButton>

                <IonTabButton tab="swap" href='/swap'>
                    <IonIcon icon={personCircle} />
                    <IonLabel>Speakers</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export default home