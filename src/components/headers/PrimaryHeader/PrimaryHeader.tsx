import { IonAvatar, IonButtons, IonHeader, IonToolbar } from '@ionic/react';
import React from 'react';
import styles from './primaryHeader.module.scss';

const PrimaryHeader: React.FC = () => {
    return (
        <IonHeader className={styles.header}>
            <IonToolbar className={styles.toolbar}>
                <IonAvatar slot='start'>
                    <img src="assets/icon/profile-icon.svg" />
                </IonAvatar>

                <img slot='end' src='assets/icon/settings-icon.svg' />
            </IonToolbar>
        </IonHeader>
    )
}

export default PrimaryHeader;