import React from 'react';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import RewardListing from '../RewardListing/RewardListing';
import styles from './primaryRewardGrid.module.scss';

interface Props {
    headers: string[],
    data?: any[]
}

const PrimaryRewardGrid: React.FC<Props> = ({ headers = [], data = [] }) => {
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
                    <RewardListing rewards={data} />
                </div>
            </div>
        </div>
    )
}

export default PrimaryRewardGrid;