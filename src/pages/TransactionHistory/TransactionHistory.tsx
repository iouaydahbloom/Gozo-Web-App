import { IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../theme/primaryTabs.scss';
import CryptoHistory from './CryptoHistory/CryptoHistory';
import useERC20Transfers from '../../hooks/useERC20Transfers';
import { TabHeaderHeightContext } from '../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import LoyaltyProgramsHistoryOptions from './LoyaltyProgramsHistoryOptions/LoyaltyProgramsHistoryOptions';
import useLoyaltyPrograms from '../../hooks/useLoyaltyPrograms';
import { UserLoyaltyProgram } from '../../models/loyaltyProgram';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../constants/appRoutes';

const TransactionHistory: React.FC = () => {

    const { eRC20Transfers, isLoadingTransfers: isLoadingERC20Transfers, fetchERC20Transfers: fetchERC20TransfersData } = useERC20Transfers();
    const [userLoyaltyPrograms, setUserLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([])

    const { defaultProgram, fetchMyLoyaltyPrograms, loadingMyLoyaltyPrograms } = useLoyaltyPrograms();
    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext)
    const [, setSelectedTabIndex] = useState(0);
    const { push } = useHistory();

    async function getAllLoyaltyPrograms() {
        return fetchMyLoyaltyPrograms()
            .then(mlp => {
                const allPrograms = defaultProgram ? [defaultProgram, ...mlp] : mlp;
                setUserLoyaltyPrograms(allPrograms)
            })
    }

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            getAllLoyaltyPrograms(),
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
                <Tabs
                    domRef={(node: any) => setTabRef(node)}
                    onSelect={(tabIndex: number) => setSelectedTabIndex(tabIndex)}>
                    <TabList>
                        <Tab>Loyalty Programs</Tab>
                        <Tab>Tokens</Tab>
                    </TabList>

                    <TabPanel>
                        <LoyaltyProgramsHistoryOptions
                            loading={loadingMyLoyaltyPrograms}
                            loyaltyPrograms={userLoyaltyPrograms}
                            onLoyaltyProgramSelected={(loyaltyProgram) =>
                                push({
                                    pathname: AppRoutes.getLoyaltyProgramTransactionHistoryDataRoute(loyaltyProgram.currency.loyaltyCurrency),
                                    state: { loyaltyProgramName: loyaltyProgram.currency.loyaltyCurrencyName }
                                })
                            } />
                    </TabPanel>
                    <TabPanel>
                        <CryptoHistory
                            isLoading={isLoadingERC20Transfers}
                            eRC20Transfers={eRC20Transfers} />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default TransactionHistory;