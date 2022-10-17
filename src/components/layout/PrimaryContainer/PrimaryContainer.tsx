import { IonContent } from '@ionic/react'
import React, { ReactNode } from 'react';
import styles from './primaryContainer.module.css';

interface Props {
    children: ReactNode,
    className?: string,
    scrollXAxis?: boolean
}

const PrimaryContainer: React.FC<Props> = ({ children, className, scrollXAxis }) => {
    return (
        <IonContent className={`ion-padding ${styles.container} ${className}`} fullscreen scroll-x={scrollXAxis}>
            {children}
        </IonContent>
    )
}

export default PrimaryContainer