import { IonContent } from '@ionic/react'
import React, { ReactNode } from 'react';
import styles from './primaryContainer.module.css';

interface Props {
    children: ReactNode
}

const PrimaryContainer: React.FC<Props> = ({ children }) => {
    return (
        <IonContent className={`ion-padding ${styles.container}`} fullscreen>
            {children}
        </IonContent>
    )
}

export default PrimaryContainer