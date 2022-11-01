import React from 'react';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import RewardListing from '../RewardListing/RewardListing';
import styles from './primaryRewardGrid.module.scss';

interface Props {
    headers: any[],
    data?: any[]
}

const PrimaryRewardGrid: React.FC<Props> = ({ headers = [], data = [] }) => {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.header}>
                    {
                        headers.map((header, index) => {
                            return (
                            <PrimaryTypography
                                key={index}
                                style={header.style}
                                customClassName={styles.cell}>
                                {header.text}
                            </PrimaryTypography>
                            )
})
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