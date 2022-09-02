import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React, { ReactNode } from 'react';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import styles from './accountItem.module.scss';

interface Props {
    icon: ReactNode,
    text: string,
    onClick: () => void
}

const AccountItem: React.FC<Props> = ({ icon, text, onClick }) => {
    return (
        <div className={styles.container} onClick={onClick}>
            <div className={`${styles.iconContainer} ${styles.innerContainer}`}>{icon}</div>
            <div className={`${styles.text} ${styles.innerContainer}`}>
                <PrimaryTypography size='m'>{text}</PrimaryTypography>
            </div>
            <div className={`${styles.navigation} ${styles.innerContainer}`}>
                <IonIcon icon={chevronForwardOutline} color='light' className={styles.navigateIcon} />
            </div>
        </div>
    )
}

export default AccountItem;