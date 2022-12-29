import { IonPage, useIonViewWillEnter } from '@ionic/react'
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import ReferralBanner from './ReferralBanner/ReferralBanner';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RewardHistory from './RewardHistory/RewardHistory';
import { useCallback, useContext, useEffect } from 'react';
import useReward from '../../hooks/useReward';
import { TabHeaderHeightContext } from '../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import EarnReward from './EarnReward/EarnReward';
import useAuthentication from '../../hooks/useAuthentication';

const Rewards: React.FC = () => {
    const {
        getRewards,
        getEarningRewards,
        getUserEarnings,
        isLoadingRewards,
        isLoadingEarnings,
        earningRewards,
        userEarningsList,
        rewards
    } = useReward();
    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext);
    const { isAuthenticated } = useAuthentication();

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            getRewards(),
            getEarningRewards(),
            getUserEarnings()
        ])
    }, [isAuthenticated])

    useEffect(() => {
        if (tabRef) {
            setTabHeaderHeight(tabRef.getElementsByTagName('ul')[0].offsetHeight)
        }
    }, [tabRef?.getElementsByTagName('ul')[0].offsetHeight])

    useIonViewWillEnter(() => {
        onRefresh();
    }, [isAuthenticated])

    return (
        <IonPage>
            <TertiaryHeader title='Rewards' className='ion-text-center' />
            <PrimaryContainer isRefreshable onRefresh={onRefresh}>
                <ReferralBanner />
                <Tabs
                    domRef={(node: any) => setTabRef(node)}>
                    <TabList>
                        <Tab>History</Tab>
                        <Tab>Earn</Tab>
                    </TabList>

                    <TabPanel>
                        <RewardHistory
                            isLoading={isLoadingRewards}
                            rewards={rewards}
                            reload={getRewards}
                        />
                    </TabPanel>
                    <TabPanel>
                        <EarnReward
                            earnData={earningRewards}
                            userEarningsList={userEarningsList}
                            isLoading={isLoadingEarnings}
                        />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Rewards