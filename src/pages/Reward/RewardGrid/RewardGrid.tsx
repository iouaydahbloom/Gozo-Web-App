import React, { useContext } from 'react';
import SectionLoader from '../../../components/loaders/section-loader/SectionLoader';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { TabHeaderHeightContext } from '../../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import RewardListing from '../RewardListing/RewardListing';
import styles from './rewardGrid.module.scss';

interface Props {
    headers: any[],
    data?: any[],
    isLoading?: boolean,
    placeholder?: JSX.Element,
    reload?: () => void
}

const RewardGrid: React.FC<Props> = ({ headers = [], data = [], isLoading = true, placeholder, reload }) => {
    const {tabHeaderHeight} = useContext(TabHeaderHeightContext)

    return (
        <div className={styles.container}>
            {(!isLoading && data.length === 0) ?
                placeholder
                :
                <div className={styles.grid}>
                    <div 
                        className={styles.headerWrapper}
                        style={{ top: tabHeaderHeight }}
                        >
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
                    </div>
                    <div className={styles.body}>
                        {isLoading ?
                            <SectionLoader />
                            :
                            <RewardListing rewards={data} reload={reload ? reload : () => {}}/>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default RewardGrid;