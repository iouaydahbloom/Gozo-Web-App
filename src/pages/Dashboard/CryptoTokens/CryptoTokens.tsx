import { IonIcon } from "@ionic/react";
import { arrowDownOutline, arrowUpOutline, swapHorizontalOutline } from "ionicons/icons";
import { useCallback, useContext } from "react";
import { useMoralis } from "react-moralis";
import PrimaryButtonsGroup from "../../../components/buttons/PrimaryButtonsGroup/PrimaryButtonsGroup";
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography";
import { AssetMode } from "../../../constants/assetsMode";
import useERC20Assets from "../../../hooks/useERC20Assets";
import usePrimarySheet from "../../../hooks/usePrimarySheet";
import { ERC20Asset } from "../../../models/assets/ERC20Asset";
import { currencySettingsContext } from "../../../providers/CurrencySettingsProvider/currencySettingsContext";
import ReceiveCrypto from "../../ReceiveCrypto/ReceiveCrypto";
import SendCrypto from "../../SendCrypto/SendCrypto";
import Swap from "../../Swap/Swap";
import CryptoTokenItem from "./CryptoTokenItem/CryptoTokenItem";
import styles from './cryptoTokens.module.scss';

interface Props {
    chain?: string,
    setToken?: (item: any) => any
}

const CryptoTokens: React.FC<Props> = ({ chain, setToken }) => {

    const { assets, fetchERC20Assets } = useERC20Assets(chain);
    const { fetchToken } = useContext(currencySettingsContext);

    const { Moralis } = useMoralis();
    const { showModal: showSwap } = usePrimarySheet({
        title: 'Swap',
        component: Swap,
        componentProps: { mode: AssetMode.token },
        id: 'swapModal',
        onDismiss: () => {
            fetchToken();
            fetchERC20Assets();
        }
    });

    const { showModal: showSendToken } = usePrimarySheet({
        title: 'Send Tokens',
        component: SendCrypto,
        id: 'sendCryptoModal',
        onDismiss: () => {
            fetchToken();
            fetchERC20Assets();
        }
    });

    const { showModal: showReceiveToken } = usePrimarySheet({
        title: 'Receive Tokens',
        component: ReceiveCrypto,
        id: 'receciveCryptoModal'
    });

    const renderItem = useCallback((item: ERC20Asset, index: number) => {
        return (
            <div key={`token_${index}`} onClick={() => (setToken ? setToken(item) : null)}>
                <CryptoTokenItem
                    name={item.name}
                    logo={item.logo ?? ''}
                    balance={parseFloat(Moralis.Units.FromWei(item.balance, parseInt(item.decimals)))}
                    symbol={item.symbol}
                />
            </div>
        )
    }, [chain])

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <PrimaryButtonsGroup
                    buttons={[
                        { title: 'Send', icon: <IonIcon icon={arrowUpOutline} />, onClick: showSendToken },
                        { title: 'Receive', icon: <IonIcon icon={arrowDownOutline} />, onClick: showReceiveToken },
                        { title: 'Swap', icon: <IonIcon icon={swapHorizontalOutline} />, onClick: showSwap }
                    ]}
                />
            </div>
            {
                assets && assets.length > 0 ?
                    <>
                        {assets.map((asset, index) => {
                            return renderItem(asset, index)
                        })}
                    </> :
                    <PrimaryTypography customClassName={styles.noDataContainer}>No Tokens in your wallet</PrimaryTypography>
            }
        </div>
    )
}

export default CryptoTokens;
