import { IonApp, setupIonicReact } from '@ionic/react';
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
import TabMenu from './components/menus/TabMenu/TabMenu';
import { useContext, useEffect } from 'react';
import { sessionContext } from './providers/SessionProvider/sessionContext';
import { SplashScreen } from '@capacitor/splash-screen';
import useOnBoardingPreview from './hooks/useOnBoardingPreview';
import { useDapp } from './providers/DappProvider/DappProvider';

setupIonicReact();

const App: React.FC = () => {

  const { isSessionReady } = useContext(sessionContext);
  const { isReady: isOnboardingStateReady } = useOnBoardingPreview();
  const { isReady: isDappReady } = useDapp();


  useEffect(() => {
    if (isSessionReady) SplashScreen.hide({
      fadeOutDuration: 600
    });
  }, [isSessionReady])

  return (
    <>
      {(isSessionReady && isOnboardingStateReady && isDappReady) && <IonApp>
        <IonReactRouter>
          <TabMenu />
        </IonReactRouter>
      </IonApp>}
    </>
  )
}

export default App;
