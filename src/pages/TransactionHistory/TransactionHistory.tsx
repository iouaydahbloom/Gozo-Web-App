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
// import { ERC20Transfer } from '../../models/assets/ERC20Transfer';


const TransactionHistory: React.FC = () => {
    const { getTransactions } = useProgramsTransactionHistory()
    const { eRC20Transfers, isLoadingTransfers:isLoadingERC20Transfers, fetchERC20Transfers: fetchERC20TransfersData } = useERC20Transfers();
    const { 
        data: historyFields, 
        isLoading: isLoadingHistoryFields, 
        hasMore: hasMoreLoyaltyHistoryFields, 
        loadMore: loadMoreLoyaltyHistoryFields, 
        fetchData: fetchLoyaltyHistoryFieldsData 
    } = useServerPagination<LoyaltyMemberHistory, any>({
        getData: getTransactions as any
    })

    // const { 
    //     data: eRC20Transfers, 
    //     isLoading: isLoadingERC20Transfers, 
    //     hasMore: hasMoreERC20Transfers, 
    //     loadMore: loadMoreERC20Transfers, 
    //     fetchData: fetchERC20TransfersData 
    // } = useServerPagination<ERC20Transfer, any>({
    //     getData: fetchERC20Transfers as any
    // })

    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext)
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)

    const loadMoreTransactions = (ev: any) => {
        setTimeout(() => {
            ev.target.complete();
            switch (selectedTabIndex) {
                case 0:
                    loadMoreLoyaltyHistoryFields();
                    break;
                case 1:
                    // loadMoreERC20Transfers();
                    break;
            }

        }, 1000);
    }

    const isScrollDisabled = useCallback(() => {
        var isDisabled = false
        switch (selectedTabIndex) {
            case 0:
                if(!hasMoreLoyaltyHistoryFields) isDisabled = true
                break;
            case 1:
                // if(!hasMoreERC20Transfers) isDisabled = true
                isDisabled = true
                break;
        }
        return isDisabled
    }, [
        selectedTabIndex, 
        hasMoreLoyaltyHistoryFields, 
        // hasMoreERC20Transfers
    ])

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            fetchLoyaltyHistoryFieldsData(),
            fetchERC20TransfersData()
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
                                        isLoading={isLoadingHistoryFields}
                                        historyFields={historyFields}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <CryptoHistory
                                        isLoading={isLoadingERC20Transfers}
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