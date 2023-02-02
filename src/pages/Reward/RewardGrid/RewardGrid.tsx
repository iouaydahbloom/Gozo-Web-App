import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import SectionLoader from '../../../components/loaders/section-loader/SectionLoader';
import SectionPlaceholder from '../../../components/sections/SectionPlaceholder/SectionPlaceholder';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../../constants/appRoutes';
import { TabHeaderHeightContext } from '../../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';
import RewardListing from '../RewardListing/RewardListing';
import styles from './rewardGrid.module.scss';

interface Props {
    headers: any[],
    data?: any[],
    isLoading?: boolean,
    reload?: () => void
}

const RewardGrid: React.FC<Props> = ({ headers = [], data = [], isLoading = true, reload }) => {

    const { tabHeaderHeight } = useContext(TabHeaderHeightContext);
    const { push } = useHistory();

    const Placeholder = () => {
        return (
            <SectionPlaceholder
                className={styles.rewardPlaceholder}
                description='You have no rewards available yet'
                logoUrl='assets/image/no-rewards.svg'
                renderActions={() =>
                    <PrimaryButton onClick={() => push(AppRoutes.spinner)}>
                        play now
                    </PrimaryButton>
                } />
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.headerWrapper}
                    style={{ top: tabHeaderHeight }}>
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
                    {
                        isLoading ?
                            <SectionLoader />
                            :
                            data.length === 0 ?
                                <Placeholder />
                                :
                                <RewardListing rewards={data} reload={reload} />
                    }
                </div>
            </div>
        </div>
    )
}

export default RewardGrid;