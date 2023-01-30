import {IonPage, useIonViewWillEnter} from '@ionic/react';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import HighlightedBalance, {HighlightedBalanceAsset} from './HighlightedBalance/HighlightedBalance';
//@ts-ignore
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import LoyaltyPrograms from './LoyaltyPrograms/LoyaltyPrograms';
import CryptoTokens from './CryptoTokens/CryptoTokens';
import '../../theme/primaryTabs.scss';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AssetMode} from '../../constants/assetsMode';
import useOnBoardingPreview from '../../hooks/useOnBoardingPreview';
import useCryptoAssets from '../../hooks/cryptoAssets/useCryptoAssets';
import {currencySettingsContext} from '../../providers/CurrencySettingsProvider/currencySettingsContext';
import {TabHeaderHeightContext} from '../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import {parseNumber} from '../../helpers/blockchainHelper';
import styles from './dashboard.module.scss';
import useAuthentication from '../../hooks/useAuthentication';
import useLoyaltyPrograms from "../../hooks/loyaltyProgram/useLoyaltyPrograms";
import useDataQueryInvalidation from "../../hooks/queryCaching/useDataQueryInvalidation";
import {membershipQueriesIdentity} from "../../hooks/membership/membershipQueriesIdentity";

const Dashboard: React.FC = () => {

    const [mode, setMode] = useState<AssetMode>(AssetMode.loyaltyPoint);
    const {hide: hideOnboarding} = useOnBoardingPreview();
    const {assets: cryptoAssets, fetchCryptoAssets, defaultERC20Asset, isLoadingAssets} = useCryptoAssets();
    const {fetchMyLoyaltyPrograms, loadingMyLoyaltyPrograms, myPrograms} = useLoyaltyPrograms({});
    const {gozoLoyaltyMembership} = useContext(currencySettingsContext);
    const [highlightedAsset, setHighlightedAsset] = useState<HighlightedBalanceAsset>();
    const {tabRef, setTabRef, setTabHeaderHeight} = useContext(TabHeaderHeightContext);
    const {isAuthenticated} = useAuthentication();
    const {invalidate} = useDataQueryInvalidation();

    const onSelect = useCallback((tabIndex: number) => {
        setMode(tabIndex === 0 ? AssetMode.loyaltyPoint : AssetMode.token);
    }, [])

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            fetchMyLoyaltyPrograms(),
            fetchCryptoAssets(),
            invalidate(membershipQueriesIdentity.all)
        ])
    }, [isAuthenticated])

    useEffect(() => {
        if (mode === AssetMode.token) {
            setHighlightedAsset({
                balance: defaultERC20Asset ?
                    parseInt(parseNumber(defaultERC20Asset.balance)) :
                    0,
                description: 'Gozo Tokens'
            });
        }
    }, [defaultERC20Asset, mode])

    useEffect(() => {
        if (mode === AssetMode.loyaltyPoint) {
            setHighlightedAsset({
                balance: gozoLoyaltyMembership ? gozoLoyaltyMembership.balance : 0,
                description: 'Super Points'
            });
        }
    }, [gozoLoyaltyMembership, mode])

    useEffect(() => {
        if (tabRef) {
            setTabHeaderHeight(tabRef.getElementsByTagName('ul')[0].offsetHeight)
        }
    }, [tabRef?.getElementsByTagName('ul')[0].offsetHeight])

    useIonViewWillEnter(() => {
        hideOnboarding();
    }, [isAuthenticated])

    return (
        <IonPage className={styles.dashboard}>
            <PrimaryContainer isRefreshable onRefresh={onRefresh}>
                <HighlightedBalance asset={highlightedAsset}/>
                <Tabs domRef={(node: any) => setTabRef(node)} onSelect={onSelect}>
                    <TabList>
                        <Tab>Loyalty Programs</Tab>
                        <Tab>Tokens</Tab>
                    </TabList>
                    <TabPanel>
                        <LoyaltyPrograms
                            isLoading={loadingMyLoyaltyPrograms}
                            programs={myPrograms}/>
                    </TabPanel>
                    <TabPanel>
                        <CryptoTokens
                            isLoading={isLoadingAssets}
                            assets={cryptoAssets}
                        />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Dashboard;
