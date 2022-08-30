import { IonLabel } from '@ionic/react';
import React, { ReactNode } from 'react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryModal.module.scss';
import { modalController } from '@ionic/core'

interface Props {
    title: string,
    renderBody: () => ReactNode
}

const PrimaryModal: React.FC<Props> = ({ title, renderBody }) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <PrimaryTypography size='l' customClassName={styles.title}>{title}</PrimaryTypography>
                <IonLabel className={styles.closeBtn} onClick={modalController.dismiss}>
                    <PrimaryTypography>Done</PrimaryTypography>
                </IonLabel>
            </div>
            <div className={styles.body}>
                {renderBody()}
            </div>
        </div>
    )
}

export default PrimaryModal;