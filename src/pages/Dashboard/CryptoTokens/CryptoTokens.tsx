import {IonIcon} from "@ionic/react";
import {arrowDownOutline, arrowUpOutline, swapHorizontalOutline} from "ionicons/icons";
import React, {useCallback, useContext} from "react";
import PrimaryButtonsGroup from "../../../components/buttons/PrimaryButtonsGroup/PrimaryButtonsGroup";
import SectionLoader from "../../../components/loaders/section-loader/SectionLoader";
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography";
import {AssetMode} from "../../../constants/assetsMode";
import {parseNumber} from "../../../helpers/blockchainHelper";
import usePrimarySheet from "../../../hooks/usePrimarySheet";
import {ERC20Asset} from "../../../models/assets/ERC20Asset";
import {NativeAsset} from "../../../models/assets/NativeAsset";
import {TabHeaderHeightContext} from "../../../providers/TabHeaderHeightProvider/tabHeaderHeightContext";
import ReceiveCrypto from "../../ReceiveCrypto/ReceiveCrypto";
import SendCrypto from "../../SendCrypto/SendCrypto";
import Swap from "../../Swap/Swap";
import CryptoTokenItem from "./CryptoTokenItem/CryptoTokenItem";
import styles from './cryptoTokens.module.scss';

interface Props {
    assets?: (ERC20Asset | NativeAsset)[],
    isLoading: boolean
}

const CryptoTokens: React.FC<Props> = ({assets = [], isLoading}) => {

    const {tabHeaderHeight} = useContext(TabHeaderHeightContext)
    const {showModal: showSwap} = usePrimarySheet({
        title: 'Swap',
        component: Swap,
        componentProps: {mode: AssetMode.token},
        id: 'swapModal'
    });

    const {showModal: showSendToken} = usePrimarySheet({
        title: 'Send Tokens',
        component: SendCrypto,
        id: 'sendCryptoModal'
    });

    const {showModal: showReceiveToken} = usePrimarySheet({
        title: 'Receive Tokens',
        component: ReceiveCrypto,
        id: 'receciveCryptoModal'
    });

    const renderItem = useCallback((item: ERC20Asset | NativeAsset, index: number) => {
        return (
            <div key={`token_${index}`}>
                <CryptoTokenItem
                    name={item.name}
                    logo={item.logo ?? ''}
                    balance={parseFloat(parseNumber(item.balance))}
                    symbol={item.symbol}
                />
            </div>
        )
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.actions} style={{top: tabHeaderHeight}}>
                <PrimaryButtonsGroup
                    buttons={[
                        {title: 'Send', icon: <IonIcon icon={arrowUpOutline}/>, onClick: showSendToken},
                        {title: 'Receive', icon: <IonIcon icon={arrowDownOutline}/>, onClick: showReceiveToken},
                        {title: 'Swap', icon: <IonIcon icon={swapHorizontalOutline}/>, onClick: showSwap}
                    ]}
                />
            </div>
            {
                isLoading ?
                    <SectionLoader/> :
                    assets && assets.length > 0 ?
                        <>
                            {assets.map((asset, index) => {
                                return renderItem(asset, index)
                            })}
                        </> :
                        <PrimaryTypography customClassName={styles.noDataContainer}>No Tokens in your
                            wallet</PrimaryTypography>
            }
        </div>
    )
}

export default CryptoTokens;
