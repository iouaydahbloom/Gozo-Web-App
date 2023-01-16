import { IonPage, useIonViewWillEnter } from '@ionic/react';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../theme/primaryTabs.scss';
import { TabHeaderHeightContext } from '../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import LoyaltyProgramsHistoryOptions from './LoyaltyProgramsHistoryOptions/LoyaltyProgramsHistoryOptions';
import useLoyaltyPrograms from '../../hooks/loyaltyProgram/useLoyaltyPrograms';
import { UserLoyaltyProgram } from '../../models/loyaltyProgram';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../constants/appRoutes';
import CryptoHistoryOptions from './CryptoHistoryOptions/CryptoHistoryOptions';
import useCryptoAssets from '../../hooks/cryptoAssets/useCryptoAssets';
import { CryptoAsset } from '../../models/assets/CryptoAsset';
import useAuthentication from '../../hooks/useAuthentication';

const TransactionHistory: React.FC = () => {

    const [userLoyaltyPrograms, setUserLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([])
    const { defaultProgram, myPrograms, loadingMyLoyaltyPrograms,fetchMyLoyaltyPrograms } = useLoyaltyPrograms({});
    const { defaultERC20Asset, defaultNativeAsset } = useCryptoAssets();
    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext);
    const [, setSelectedTabIndex] = useState(0);
    const { push } = useHistory();
    const { isAuthenticated } = useAuthentication();

    const cryptoAssets = useMemo(() => {
        let assets = [];
        if (defaultERC20Asset) assets.push(defaultERC20Asset);
        if (defaultNativeAsset) assets.push(defaultNativeAsset);

        return assets;
    }, [defaultERC20Asset, defaultNativeAsset])

    // async function getAllLoyaltyPrograms() {
    //     return fetchMyLoyaltyPrograms()
    //         .then(mlp => {
    //             const allPrograms = defaultProgram ? [defaultProgram, ...mlp] : mlp;
    //             setUserLoyaltyPrograms(allPrograms)
    //         })
    // }

    const onRefresh = useCallback((): Promise<any> => {
        return fetchMyLoyaltyPrograms()
    }, [isAuthenticated])

    useEffect(() => {
        if (tabRef) {
            setTabHeaderHeight(tabRef.getElementsByTagName('ul')[0].offsetHeight)
        }
    }, [tabRef?.getElementsByTagName('ul')[0].offsetHeight])

    useEffect(() => {
        const allPrograms = defaultProgram ? [defaultProgram, ...myPrograms] : myPrograms;
        setUserLoyaltyPrograms(allPrograms)
    }, [defaultProgram, myPrograms])

    // useIonViewWillEnter(() => {
    //     onRefresh();
    // }, [isAuthenticated])

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
                        <CryptoHistoryOptions
                            assets={cryptoAssets.map((ca: CryptoAsset) => {
                                const asset = { ...ca } as any;
                                asset.action = (ca: CryptoAsset) =>
                                    push(AppRoutes.getCryptoTransactionHistoryDataRoute(ca.name))
                                return asset;
                            })} />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default TransactionHistory;