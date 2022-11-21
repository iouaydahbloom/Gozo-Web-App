import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { IonBadge } from '@ionic/react';
import styles from './highlightedBalance.module.scss';

export interface HighlightedBalanceAsset {
    balance: number | string,
    description: string
}

interface Props {
    asset?: HighlightedBalanceAsset,
    className?: string
}

const HighlightedBalance: React.FC<Props> = ({ asset, className }) => {
    return (
        <div className={`${styles.container} ${className}`} >
            <img src='/assets/image/gozo-element.png' className={styles.img} />
            <div className={styles.innerContainer}>
                <IonBadge className={styles.badge}>
                    <PrimaryTypography size='xxxl'> {asset ? asset.balance : 0}</PrimaryTypography>
                </IonBadge>
                <PrimaryTypography size='l' customClassName={styles.description}>{asset?.description}</PrimaryTypography>
            </div>
        </div>
    )
}

export default HighlightedBalance;