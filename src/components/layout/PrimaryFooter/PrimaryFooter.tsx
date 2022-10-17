import { IonFooter, IonToolbar } from '@ionic/react';
import React, { ReactNode } from 'react';
import styles from './primaryFooter.module.scss';

interface Props {
    children: ReactNode,
    className?: string 
}

const PrimaryFooter: React.FC<Props> = ({ children, className }) => {
    return (
        <IonFooter className={`${styles.container} ${className} ion-no-border`}>
            <IonToolbar>
                {children}
            </IonToolbar>
        </IonFooter>
    )
}

export default PrimaryFooter;