import { IonContent } from '@ionic/react'
import React, { ReactNode } from 'react';
import styles from './primaryContainer.module.css';

interface Props {
    children: ReactNode,
    className?: string
}

const PrimaryContainer: React.FC<Props> = ({ children, className }) => {
    return (
        <IonContent className={`ion-padding ${styles.container} ${className}`} fullscreen>
            {children}
        </IonContent>
    )
}

export default PrimaryContainer