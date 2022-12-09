import { IonApp, IonPage, setupIonicReact } from '@ionic/react';
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
import { useContext, useEffect, useState } from 'react';
import { sessionContext } from './providers/SessionProvider/sessionContext';
import { SplashScreen } from '@capacitor/splash-screen';
import useOnBoardingPreview from './hooks/useOnBoardingPreview';
import { useDapp } from './providers/DappProvider/DappProvider';
import PrimaryContainer from './components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryButton from './components/buttons/PrimaryButton/PrimaryButton';
import SectionPlaceholder from './components/sections/SectionPlaceholder/SectionPlaceholder';
import { initAppCrashHandler } from './helpers/appCrashHandler';

setupIonicReact();

const App: React.FC = () => {

  const { isReady: isSessionReady, refresh: refreshSession } = useContext(sessionContext);
  const { isReady: isOnboardingStateReady, refresh: refreshOnboardingPreview } = useOnBoardingPreview();
  const { isReady: isDappReady, refresh: refreshDapp } = useDapp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function onRefresh() {
    setIsRefreshing(true);
    Promise.all([
      refreshSession(),
      refreshOnboardingPreview(),
      refreshDapp()
    ])
      .finally(() => setIsRefreshing(false))
  }

  useEffect(() => {
    if (!isSessionReady || !isOnboardingStateReady || !isDappReady) return;
    SplashScreen.hide({ fadeOutDuration: 600 });
  }, [isSessionReady, isOnboardingStateReady, isDappReady])

  useEffect(() => {
    initAppCrashHandler();
  }, [])

  return (
    <IonApp>
      {
        (isSessionReady && isOnboardingStateReady && isDappReady) ?
          <IonReactRouter>
            <TabMenu />
          </IonReactRouter>
          :
          <IonPage>
            <PrimaryContainer isRefreshable onRefresh={onRefresh}>
              <SectionPlaceholder
                logoUrl='assets/image/surprise.svg'
                title='OOPS'
                description='Unable to start app, Please try again'
                renderActions={() => (
                  <PrimaryButton onClick={onRefresh} loading={isRefreshing}>Retry</PrimaryButton>
                )}
              />
            </PrimaryContainer>
          </IonPage>
      }
    </IonApp>
  )
}

export default App;
