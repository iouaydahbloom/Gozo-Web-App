import React, { ReactNode } from 'react';
import styles from './primaryModal.module.scss';
import { modalController } from '@ionic/core'
import PrimaryModalToolbar from './PrimaryModalToolbar/PrimaryModalToolbar';

interface Props {
    title: string,
    renderBody: () => ReactNode
}

const PrimaryModal: React.FC<Props> = ({ title, renderBody }) => {
    return (
        <div className={styles.container}>
            <PrimaryModalToolbar title={title} onClick={modalController.dismiss} />
            <div className={styles.body}>
                {renderBody()}
            </div>
        </div>
    )
}

export default PrimaryModal;