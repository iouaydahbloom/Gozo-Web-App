import React, { ReactNode } from 'react';
import styles from './primaryModal.module.scss';
import { modalController } from '@ionic/core'
import PrimaryToolbar from '../../toolbars/primary-toolbar/PrimaryToolbar';

interface Props {
    title: string,
    renderBody: () => ReactNode
}

const PrimaryModal: React.FC<Props> = ({ title, renderBody }) => {
    return (
        <div className={styles.container}>
            <PrimaryToolbar title={title} onClick={modalController.dismiss} />
            <div className={styles.body}>
                {renderBody()}
            </div>
        </div>
    )
}

export default PrimaryModal;