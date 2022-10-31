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
import useOnBoardingPreview from '../../hooks/useOnBoardingPreview';
import useAssets from '../../hooks/useAssets';
import useERC20Assets from '../../hooks/useERC20Assets';
import { currencySettingsContext } from '../../providers/CurrencySettingsProvider/currencySettingsContext';

const Dashboard: React.FC = () => {

    const [mode, setMode] = useState<AssetMode>(AssetMode.loyaltyPoint);
    const { hide } = useOnBoardingPreview();
    const { getUserLoyaltyPrograms } = useAssets();
    const { assets, fetchERC20Assets } = useERC20Assets();
    const {
        gozoToken,
        gozoLoyaltyMembership,
        fetchToken,
        fetchGozoLoyaltyMembership
    } = useContext(currencySettingsContext);

    function onSelect(tabIndex: number) {
        setMode(tabIndex == 0 ? AssetMode.loyaltyPoint : AssetMode.token);
    }

    async function onRefresh(): Promise<any> {
        return Promise.all([
            getUserLoyaltyPrograms(),
            fetchERC20Assets(),
            fetchToken(),
            fetchGozoLoyaltyMembership()
        ])
    }

    useIonViewDidEnter(() => {
        hide();
    })

    return (
        <IonPage>
            <PrimaryContainer isRefreshable onRefresh={onRefresh}>
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
