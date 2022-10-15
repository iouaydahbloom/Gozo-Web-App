import { IonPage, useIonViewDidEnter } from '@ionic/react';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import HighlightedBalance from './HighlightedBalance/HighlightedBalance';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import LoyaltyPrograms from './LoyaltyPrograms/LoyaltyPrograms';
import CryptoTokens from './CryptoTokens/CryptoTokens';
import '../../theme/primaryTabs.scss';
import { useContext, useState } from 'react';
import { AssetMode } from '../../constants/assetsMode';
import styles from './dashboard.module.scss'
import { HideScreenContext, IHideScreen } from '../../providers/HideScreenProvider/HideScreenProvider.context';
import useHideScreen from '../../hooks/useHideScreen';


const Dashboard: React.FC = () => {

    const [mode, setMode] = useState<AssetMode>(AssetMode.loyaltyPoint);
    const { setHideScreen } = useContext(HideScreenContext) as IHideScreen;
    const { storeHideFlag } = useHideScreen()

    function onSelect(tabIndex: number) {
        setMode(tabIndex == 0 ? AssetMode.loyaltyPoint : AssetMode.token);
    }

    useIonViewDidEnter(() => {
        storeHideFlag().then((result) => {
            setHideScreen(result)
        })
    })

    return (
        <IonPage>
            <PrimaryContainer>
                <HighlightedBalance mode={mode} />
                <Tabs onSelect={onSelect}>
                    <TabList className={styles.tabList}>
                        <Tab className={styles.tab}>Loyalty Programs</Tab>
                        <Tab className={styles.tab}>Tokens</Tab>
                    </TabList>

                    <TabPanel>
                        <LoyaltyPrograms />
                    </TabPanel>
                    <TabPanel>
                        <CryptoTokens />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Dashboard;
