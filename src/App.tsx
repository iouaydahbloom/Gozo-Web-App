import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/main.scss';
import './theme/toast.scss';

import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import { AppRoutes } from './constants/appRoutes';
import ProtectedRoute from './components/routes/ProtectedRoute/ProtectedRoute';
import OnBoarding from './pages/OnBoarding/OnBoarding';
import PurePublicRoute from './components/routes/PurePublicRoute/PurePublicRoute';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <ProtectedRoute exact path={AppRoutes.dashboard}>
          <Dashboard />
        </ProtectedRoute>
        <Route exact path={AppRoutes.landing}>
          <Landing />
        </Route>
        <ProtectedRoute exact path={AppRoutes.onBoarding}>
          <OnBoarding />
        </ProtectedRoute>
        <Route exact path="/">
          <Redirect to={AppRoutes.landing} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
)

export default App;
