import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React from 'react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryGrid.module.scss';

interface Props {
    headers: string[],
    data?: any[]
}

const PrimaryGrid: React.FC<Props> = ({ headers = [], data = [] }) => {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.header}>
                    {
                        headers.map((header, index) => (
                            <PrimaryTypography
                                key={index}
                                customClassName={styles.text}>
                                {header}
                            </PrimaryTypography>
                        ))
                    }
                </div>
                <div className={styles.body}>
                    {
                        data.map((obj, index) => (
                            <div className={styles.bodyData} key={index} onClick={obj.onClick}>
                                {Object.keys(obj).map((key, index) => (
                                    key !== 'onClick' &&
                                    <PrimaryTypography
                                        key={index}
                                        customClassName={styles.text}>
                                        {obj[key]}
                                    </PrimaryTypography>
                                ))}
                                <IonIcon color='light' size="small" icon={chevronForwardOutline}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PrimaryGrid;