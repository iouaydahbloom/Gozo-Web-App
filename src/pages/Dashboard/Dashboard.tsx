import { IonPage } from '@ionic/react';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import HighlightedBalance from './HighlightedBalance/HighlightedBalance';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import LoyaltyPrograms from './LoyaltyPrograms/LoyaltyPrograms';
import CryptoTokens from './CryptoTokens/CryptoTokens';
import PrimaryHeader from '../../components/headers/PrimaryHeader/PrimaryHeader';
import '../../theme/primaryTabs.scss';
import { useState } from 'react';
import { AssetMode } from '../../constants/assetsMode';

const Dashboard: React.FC = () => {

    const [mode, setMode] = useState<AssetMode>(AssetMode.loyaltyPoint);

    function onSelect(tabIndex: number) {
        setMode(tabIndex == 0 ? AssetMode.loyaltyPoint : AssetMode.token);
    }

    return (
        <IonPage>
            <PrimaryHeader />
            <PrimaryContainer>
                <HighlightedBalance mode={mode} />
                <Tabs onSelect={onSelect}>
                    <TabList>
                        <Tab>Loyalty Programs</Tab>
                        <Tab>Tokens</Tab>
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
