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
import { AccordionItemData } from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';

const earnData: AccordionItemData[] = [
    new AccordionItemData('0', 'Fill that survey and earn 1000 Superpoints', 'www.addbloom.com', 'assets/icon/transaction-history.svg'),
    new AccordionItemData('1', 'Fill that survey and earn 1000 Superpoints', 'www.addbloom.com', 'assets/icon/transaction-history.svg'),
    new AccordionItemData('2', 'Fill that survey and earn 1000 Superpoints', 'www.addbloom.com', 'assets/icon/transaction-history.svg')
]

const Rewards: React.FC = () => {
    const { getRewards, isLoadingRewards, rewards } = useReward()
    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext)

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            getRewards()
        ])
    }, [])

    useIonViewWillEnter(() => {
        onRefresh();
    })

    useEffect(() => {
        if (tabRef) {
            setTabHeaderHeight(tabRef.getElementsByTagName('ul')[0].offsetHeight)
        }
    }, [tabRef?.getElementsByTagName('ul')[0].offsetHeight])

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
                        />
                    </TabPanel>
                    <TabPanel>
                        <EarnReward earnData={earnData} />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Rewards