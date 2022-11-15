import { IonPage } from '@ionic/react';
import React from 'react'
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../theme/primaryTabs.scss';
import LoyaltyPogramsHistory from './LoyaltyProgramsHistory/LoyaltyPogramsHistory';
import CryptoHistory from './CryptoHistory/CryptoHistory';

const TransactionHistory: React.FC = () => {
    return (
        <IonPage>
            <SecondaryHeader
                title='Transaction History' />
            <PrimaryContainer>
                <Tabs>
                    <TabList>
                        <Tab>Loyalty Programs</Tab>
                        <Tab>Tokens</Tab>
                    </TabList>

                    <TabPanel>
                        <LoyaltyPogramsHistory />
                    </TabPanel>
                    <TabPanel>
                        <CryptoHistory />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default TransactionHistory;