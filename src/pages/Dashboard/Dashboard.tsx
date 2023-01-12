import { IonPage, useIonViewWillEnter } from '@ionic/react';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import HighlightedBalance, { HighlightedBalanceAsset } from './HighlightedBalance/HighlightedBalance';
//@ts-ignore
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import LoyaltyPrograms from './LoyaltyPrograms/LoyaltyPrograms';
import CryptoTokens from './CryptoTokens/CryptoTokens';
import '../../theme/primaryTabs.scss';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AssetMode } from '../../constants/assetsMode';
import useOnBoardingPreview from '../../hooks/useOnBoardingPreview';
import useCryptoAssets from '../../hooks/useCryptoAssets';
import { currencySettingsContext } from '../../providers/CurrencySettingsProvider/currencySettingsContext';
//import { UserLoyaltyProgram } from '../../models/loyaltyProgram';
//import useLoyaltyPrograms from '../../hooks/useLoyaltyPrograms';
import { TabHeaderHeightContext } from '../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import { parseNumber } from '../../helpers/blockchainHelper';
import styles from './dashboard.module.scss';
import useAuthentication from '../../hooks/useAuthentication';
import useUserProgramsQuery from '../../hooks/query/useUserProgramsQuery';

const Dashboard: React.FC = () => {

    const [mode, setMode] = useState<AssetMode>(AssetMode.loyaltyPoint);
    const { hide: hideOnboarding } = useOnBoardingPreview();
    //const { loadingMyLoyaltyPrograms } = useLoyaltyPrograms();
    //const [loyaltyPrograms, setLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const { assets: cryptoAssets, fetchCryptoAssets, defaultERC20Asset, isLoadingAssets } = useCryptoAssets();
    const { gozoLoyaltyMembership, fetchGozoLoyaltyMembership } = useContext(currencySettingsContext);
    const [highlightedAsset, setHighlightedAsset] = useState<HighlightedBalanceAsset>();
    const { tabRef, setTabRef, setTabHeaderHeight } = useContext(TabHeaderHeightContext);
    const { isAuthenticated } = useAuthentication();
    const userProgramsQuery = useUserProgramsQuery();

    const onSelect = useCallback((tabIndex: number) => {
        setMode(tabIndex === 0 ? AssetMode.loyaltyPoint : AssetMode.token);
    }, [])

    // const getPrograms = async () => {
    //     setLoyaltyPrograms([])
    //     const programs = await fetchMyLoyaltyPrograms();
    //     const programs = await userProgramsQuery.refetch()
    //     setLoyaltyPrograms(programs);
    //     return programs;
    // }

    const handleHighlightedAssetMetadata = () => {
        mode === AssetMode.loyaltyPoint ? fetchGozoLoyaltyMembership() : fetchCryptoAssets();
    }

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            userProgramsQuery.refetch(),
            fetchCryptoAssets(),
            handleHighlightedAssetMetadata()
        ])
    }, [isAuthenticated])

    useEffect(() => {
        handleHighlightedAssetMetadata();
    }, [mode])

    useEffect(() => {
        if (mode === AssetMode.token) {
            setHighlightedAsset({
                balance: defaultERC20Asset ?
                    parseInt(parseNumber(defaultERC20Asset.balance)) :
                    0,
                description: 'Gozo Tokens'
            });
        }
    }, [defaultERC20Asset])

    useEffect(() => {
        if (mode === AssetMode.loyaltyPoint) {
            setHighlightedAsset({
                balance: gozoLoyaltyMembership ? gozoLoyaltyMembership.balance : 0,
                description: 'Super Points'
            });
        }
    }, [gozoLoyaltyMembership])

    useEffect(() => {
        if (tabRef) {
            setTabHeaderHeight(tabRef.getElementsByTagName('ul')[0].offsetHeight)
        }
    }, [tabRef?.getElementsByTagName('ul')[0].offsetHeight])

    useIonViewWillEnter(() => {
        hideOnboarding();
        //onRefresh();
    }, [isAuthenticated])

    return (
        <IonPage className={styles.dashboard}>
            <PrimaryContainer isRefreshable onRefresh={onRefresh}>
                <HighlightedBalance asset={highlightedAsset} />
                <Tabs domRef={(node: any) => setTabRef(node)} onSelect={onSelect}>
                    <TabList>
                        <Tab>Loyalty Programs</Tab>
                        <Tab>Tokens</Tab>
                    </TabList>
                    <TabPanel>
                        <LoyaltyPrograms
                            isLoading={userProgramsQuery.isLoading}
                            programs={userProgramsQuery.data ?? []}
                            getPrograms={userProgramsQuery.refetch} />
                    </TabPanel>
                    <TabPanel>
                        <CryptoTokens
                            isLoading={isLoadingAssets}
                            assets={cryptoAssets}
                            refreshDefaultToken={fetchCryptoAssets}
                            getAssets={fetchCryptoAssets} />
                    </TabPanel>
                </Tabs>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Dashboard;
