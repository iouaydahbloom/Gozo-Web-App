import React, { useLayoutEffect } from 'react';
import { useHistory } from 'react-router';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import SectionLoader from '../../../components/loaders/section-loader/SectionLoader';
import SectionPlaceholder from '../../../components/sections/SectionPlaceholder/SectionPlaceholder';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../../constants/appRoutes';
import useElementsHeight from '../../../hooks/useElementsHeight';
import RewardListing from '../RewardListing/RewardListing';
import styles from './rewardGrid.module.scss';

interface Props {
    headers: any[],
    data?: any[],
    isLoading?: boolean
}

const RewardGrid: React.FC<Props> = ({ headers = [], data = [], isLoading = true }) => {
    const { push } = useHistory()
    const { internalTabHeight, getInternalTabHeight } = useElementsHeight()
    console.log("internalTabHeight", internalTabHeight)

    useLayoutEffect(() => {
        getInternalTabHeight()
    })
    return (
        <div className={styles.container}>
            {(!isLoading && data.length === 0) ?
                <SectionPlaceholder
                    description='You have no rewards available yet'
                    logoUrl='assets/image/no-rewards.svg'
                    renderActions={() => <PrimaryButton onClick={() => push(AppRoutes.spinner)}>play now</PrimaryButton>}
                />
                :
                <div className={styles.grid}>
                    <div 
                        className={styles.headerWrapper}
                        style={{ top: internalTabHeight }}
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
                            <RewardListing rewards={data} />
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default RewardGrid;