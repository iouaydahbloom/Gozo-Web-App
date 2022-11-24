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
import { TabHeightContext } from '../../providers/TabHeightProvider/tabHeightContext';
import { Virtuoso } from 'react-virtuoso';
import { InfiniteScrollPagination } from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';

interface ITab {
    value: string,
    isScrollDisabled: boolean
}

const TransactionHistory: React.FC = () => {
    const { isLoadingHistory, historyFields, getTransactions, transactionCount } = useProgramsTransactionHistory()
    const { eRC20Transfers, isLoadingTransfers, fetchERC20Transfers } = useERC20Transfers();
    const { setTabHeight } = useContext(TabHeightContext)
    const [tabRef, setTabRef] = useState<any>()
    const [selectedTabIndex, setSelectedTabIndex] = useState(0)
    const [tabs, setTabs] = useState<ITab[]>([
        { value: 'points', isScrollDisabled: false },
        { value: 'tokens', isScrollDisabled: false }
    ])

    const loadMoreTransactions = (ev: any) => {
        console.log("entered")
        setTimeout(() => {
            ev.target.complete();
            switch (selectedTabIndex) {
                case 0:
                    getTransactions();
                    if (historyFields.length === transactionCount) {
                        setTabs(tabs.map((item, index) => {
                            if (index === selectedTabIndex) {
                                return { ...item, isScrollDisabled: true };
                            } else {
                                return item;
                            }
                        }));
                    }
                    break;
                case 1:
                    // to be specified once pagination is implemented 
                    break;
            }

        }, 500);
    }

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            getTransactions(),
            fetchERC20Transfers()
        ])
    }, [])

    useIonViewWillEnter(() => {
        onRefresh();
    })

    useEffect(() => {
        if (tabRef) {
            setTabHeight(tabRef.getElementsByTagName('ul')[0].offsetHeight)
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
                        Footer: () => InfiniteScrollPagination(loadMoreTransactions, tabs[selectedTabIndex].isScrollDisabled)
                    }}
                >

                </Virtuoso>

            </PrimaryContainer>
        </IonPage>
    )
}

export default TransactionHistory;