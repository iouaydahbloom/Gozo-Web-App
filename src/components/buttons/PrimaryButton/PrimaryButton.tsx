import { IonButton } from '@ionic/react';
import React, { ReactNode } from 'react';
import styles from './primaryButton.module.scss';

interface Props {
    children: ReactNode,
    onClick?: () => void
}

const PrimaryButton: React.FC<Props> = ({ children, onClick }) => {
    return (
        <IonButton
            color='primary'
            expand='block'
            className={styles.button}
            onClick={onClick}>
            {children}
        </IonButton>
    )
}

export default PrimaryButton