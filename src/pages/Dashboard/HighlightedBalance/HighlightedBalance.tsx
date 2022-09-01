import { useContext, useEffect, useState } from 'react';
import { currencySettingsContext } from '../../../providers/CurrencySettingsProvider/currencySettingsContext';
import useMemberShip from '../../../hooks/useMembership'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { IonBadge } from '@ionic/react';
import styles from './highlightedBalance.module.scss';
import { AssetMode } from '../../../constants/assetsMode';
import useERC20Assets from '../../../hooks/useERC20Assets';
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
    const { gozoLoyalty } = useContext(currencySettingsContext);
    const { membership } = useMemberShip(gozoLoyalty?.currency?.loyaltyCurrency);
    const { defaultAsset } = useERC20Assets();

    const [asset, setAsset] = useState<Asset>();

    useEffect(() => {
        console.log('default asset ', defaultAsset);
        if (mode == AssetMode.token) {
            setAsset({
                balance: defaultAsset ? parseFloat(Moralis.Units.FromWei(defaultAsset.balance, parseInt(defaultAsset.decimals))) : 0,
                description: 'Gozo Tokens'
            });
        } else {
            setAsset({
                balance: membership ? membership.balance : 0,
                description: 'Super Points'
            });
        }
    }, [mode, membership])

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