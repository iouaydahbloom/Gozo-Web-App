import { IonBackButton, IonButtons, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { AppRoutes } from '../../../constants/appRoutes';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './secondaryHeader.module.scss';

interface Props {
    title: string
}

const SecondaryHeader: React.FC<Props> = ({ title }) => {

    return (
        <IonHeader className={styles.header}>
            <IonToolbar className={styles.toolbar} mode='ios'>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={AppRoutes.dashboard} text="" icon="assets/icon/header-back.svg" className={styles.icon}/>
                </IonButtons>
                <IonTitle>
                    <PrimaryTypography customClassName={styles.text} size='l'>{title}</PrimaryTypography>
                </IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default SecondaryHeader;