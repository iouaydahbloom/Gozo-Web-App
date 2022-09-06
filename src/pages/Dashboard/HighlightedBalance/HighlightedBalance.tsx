import { useContext, useEffect, useState } from 'react';
import { currencySettingsContext } from '../../../providers/CurrencySettingsProvider/currencySettingsContext';
import useMemberShip from '../../../hooks/useMembership'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { IonBadge } from '@ionic/react';
import styles from './highlightedBalance.module.scss';
import { AssetMode } from '../../../constants/assetsMode';
import useERC20Assets from '../../../hooks/useERC20Assets';
import useBlockchain from '../../../hooks/useBlockchain';

interface Props {
    mode: AssetMode
}

interface Asset {
    balance: number | string,
    description: string
}

const HighlightedBalance: React.FC<Props> = ({ mode }) => {

    const { helpers } = useBlockchain();
    const { gozoToken, gozoLoyaltyMembership } = useContext(currencySettingsContext);
    const [asset, setAsset] = useState<Asset>();

    useEffect(() => {
        if (mode == AssetMode.token) {
            setAsset({
                balance: gozoToken ? parseFloat(helpers.Units.FromWei(gozoToken.balance, parseInt(gozoToken.decimals))) : 0,
                description: 'Gozo Tokens'
            });
        } else {
            setAsset({
                balance: gozoLoyaltyMembership ? gozoLoyaltyMembership.balance : 0,
                description: 'Super Points'
            });
        }
    }, [mode, gozoLoyaltyMembership, gozoToken])

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