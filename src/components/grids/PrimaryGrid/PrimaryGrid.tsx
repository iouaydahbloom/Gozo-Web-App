import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import PrimaryButton from '../../buttons/PrimaryButton/PrimaryButton';
import SectionLoader from '../../loaders/section-loader/SectionLoader';
import SectionPlaceholder from '../../sections/SectionPlaceholder/SectionPlaceholder';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryGrid.module.scss';
import { TabHeightContext } from '../../../providers/TabHeightProvider/tabHeightContext';

interface Props {
    headers: string[],
    data?: any[],
    isLoading?: boolean
}

const PrimaryGrid: React.FC<Props> = ({ headers = [], data = [], isLoading }) => {
    const { push } = useHistory()
    const { tabHeight } = useContext(TabHeightContext)

    return (
        <div className={styles.container}>
            {(!isLoading && data.length === 0) ?
                <SectionPlaceholder
                    description='You have no past transaction details here yet'
                    logoUrl='assets/image/no-transactions.svg'
                    renderActions={() => <PrimaryButton onClick={() => push(AppRoutes.spinner)}>play now</PrimaryButton>}
                />
                :
                <div className={styles.grid}>
                    <div
                        className={styles.headerWrapper}
                        style={{ top: tabHeight }}
                    >
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
                    </div>

                    <div className={styles.body}>

                        {isLoading ?
                            <SectionLoader />
                            :
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
                                    <IonIcon color='light' size="small" icon={chevronForwardOutline} />
                                </div>
                            ))
                        }
                    </div>

                </div>
            }
        </div>
    )
}

export default PrimaryGrid;