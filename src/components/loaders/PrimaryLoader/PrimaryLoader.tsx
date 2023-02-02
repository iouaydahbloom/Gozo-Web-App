import { IonSpinner } from '@ionic/react';
import React from 'react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryLoader.module.scss'

const PrimaryLoader: React.FC = () => {
    return (
        <div className={styles.spinner}>
            <PrimaryTypography size='l'>Loading...</PrimaryTypography>
            <IonSpinner color='light' className={styles.icon} />
        </div>
    )
}

export default PrimaryLoader;