import { IonBackButton, IonHeader, IonIcon, IonToolbar } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './secondaryHeader.module.scss';

interface Props {
    title: string
}

const SecondaryHeader: React.FC<Props> = ({ title }) => {

    const { goBack } = useHistory();

    return (
        <IonHeader className={styles.header}>
            <div className={styles.toolbar}>
                <div className={styles.icon}>
                    {/* <IonIcon color='light' size='large' icon={arrowBackOutline} onClick={goBack}/> */}
                    <img src='assets/icon/header-back.svg' onClick={goBack} />
                </div>
                <div className={styles.text}>
                    <PrimaryTypography size='l'>{title}</PrimaryTypography>
                </div>
            </div>
        </IonHeader>
    )
}

export default SecondaryHeader;