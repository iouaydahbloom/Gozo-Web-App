import React from 'react';
import PrimarySearch from '../../inputs/PrimarySearch/PrimarySearch';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryGrid.module.scss';

interface Props {
    headers: string[],
    data?: any[]
}

const PrimaryGrid: React.FC<Props> = ({ headers = [], data = [] }) => {
    return (
        <div className={styles.container}>
            <PrimarySearch />
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
                            <div className={styles.bodyData} key={index}>
                                {Object.keys(obj).map((key, index) => (
                                    <PrimaryTypography
                                        key={index}
                                        customClassName={styles.text}>
                                        {obj[key]}
                                    </PrimaryTypography>
                                ))}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default PrimaryGrid;