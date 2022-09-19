import { useContext, useEffect, useState } from 'react';
import { currencySettingsContext } from '../../../providers/CurrencySettingsProvider/currencySettingsContext';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { IonBadge } from '@ionic/react';
import styles from './highlightedBalance.module.scss';
import { AssetMode } from '../../../constants/assetsMode';
import { useMoralis } from 'react-moralis';

interface Props {
    mode: AssetMode
}

interface Asset {
    balance: number | string,
    description: string
}

const HighlightedBalance: React.FC<Props> = ({ mode }) => {

    const { Moralis } = useMoralis();
    const { gozoToken, gozoLoyaltyMembership, fetchToken, fetchGozoLoyaltyMembership } = useContext(currencySettingsContext);
    const [asset, setAsset] = useState<Asset>();

    useEffect(() => {
        if (mode == AssetMode.token) {
            fetchToken();
        } else if (mode == AssetMode.loyaltyPoint) {
            fetchGozoLoyaltyMembership()
        }
    }, [mode])

    useEffect(() => {
        if (mode == AssetMode.token) {
            setAsset({
                balance: gozoToken ? parseFloat(Moralis.Units.FromWei(gozoToken.balance, parseInt(gozoToken.decimals))) : 0,
                description: 'Gozo Tokens'
            });
        }
    }, [gozoToken])

    useEffect(() => {
        if (mode == AssetMode.loyaltyPoint) {
            setAsset({
                balance: gozoLoyaltyMembership ? gozoLoyaltyMembership.balance : 0,
                description: 'Super Points'
            });
        }
    }, [gozoLoyaltyMembership])

    return (
        <div className={styles.container}>
            <div className={styles.innerContainer}>
                <IonBadge className={styles.badge}>
                    <PrimaryTypography size='xxl'> {asset ? asset.balance : 0}</PrimaryTypography>
                </IonBadge>
                <PrimaryTypography size='xl' customClassName={styles.description}>{asset?.description}</PrimaryTypography>
            </div>
        </div>
    )
}

export default HighlightedBalance;