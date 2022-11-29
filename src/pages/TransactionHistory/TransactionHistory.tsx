import { IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../theme/primaryTabs.scss';
import LoyaltyPogramsHistory from './LoyaltyProgramsHistory/LoyaltyPogramsHistory';
import CryptoHistory from './CryptoHistory/CryptoHistory';
import useProgramsTransactionHistory from '../../hooks/useProgramsTransactionHistory';
import useERC20Transfers from '../../hooks/useERC20Transfers';
import { TabHeaderHeightContext } from '../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import { Virtuoso } from 'react-virtuoso';
import { InfiniteScrollPagination } from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import useServerPagination from '../../hooks/useServerPagination';
import { LoyaltyMemberHistory } from '../../models/loyaltyMember';


const TransactionHistory: React.FC = () => {
    const { getTransactions } = useProgramsTransactionHistory()

    const { data: historyFields, isLoading: isLoadingHistory, hasMore, loadMore, fetchData } = useServerPagination<LoyaltyMemberHistory, any>({
        getData: getTransactions as any
    })
    const { eRC20Transfers, isLoadingTransfers, fetchERC20Transfers } = useERC20Transfers();
    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const loadMoreTransactions = (ev: any) => {
        setTimeout(() => {
            ev.target.complete();
            switch (selectedTabIndex) {
                case 0:
                    loadMore();
                    break;
                case 1:
                    // to be specified once pagination is implemented 
                    break;
            }

        }, 500);
    }

    const isScrollDisabled = useCallback(() => {
        var isDisabled = false
        switch (selectedTabIndex) {
            case 0:
                if(!hasMore) isDisabled = true
                break;
            case 1:
                isDisabled = true
                // to be specified once pagination is implemented 
                break;
        }
        return isDisabled
    }, [selectedTabIndex, hasMore])

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            fetchData(),
            fetchERC20Transfers()
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
            <SecondaryHeader
                title='Transaction History' />
            <PrimaryContainer scrollYAxis={false} isRefreshable onRefresh={onRefresh}>
                <Virtuoso
                    className="ion-content-scroll-host"
                    style={{ height: "83vh", }}
                    totalCount={1}
                    itemContent={() => {
                        return (
                            <Tabs
                                domRef={(node: any) => setTabRef(node)}
                                onSelect={(tabIndex: number) => setSelectedTabIndex(tabIndex)}>
                                <TabList>
                                    <Tab>Loyalty Programs</Tab>
                                    <Tab>Tokens</Tab>
                                </TabList>

                                <TabPanel>
                                    <LoyaltyPogramsHistory
                                        isLoading={isLoadingHistory}
                                        historyFields={historyFields}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <CryptoHistory
                                        isLoading={isLoadingTransfers}
                                        eRC20Transfers={eRC20Transfers} />
                                </TabPanel>
                            </Tabs>
                        )
                    }
                    }
                    components={{
                        Footer: () => InfiniteScrollPagination(loadMoreTransactions, isScrollDisabled())
                    }}
                >

                </Virtuoso>

            </PrimaryContainer>
        </IonPage>
    )
}

export default TransactionHistory;