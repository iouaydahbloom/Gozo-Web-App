import React, { ReactNode } from 'react';
import styles from './primaryModal.module.scss';
import { modalController } from '@ionic/core'
import PrimaryModalToolbar from './PrimaryModalToolbar/PrimaryModalToolbar';
import { IonContent } from '@ionic/react';

interface Props {
    title: string,
    renderBody: () => ReactNode
}

const PrimaryModal: React.FC<Props> = ({ title, renderBody }) => {
    return (
        <>
            <PrimaryModalToolbar title={title} onClick={modalController.dismiss} />
            <IonContent className={styles.content}>
            {renderBody()}
            </IonContent>
        </>
    )
}

export default PrimaryModal;