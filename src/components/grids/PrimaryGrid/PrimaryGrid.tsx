import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React, { useContext } from 'react';
import SectionLoader from '../../loaders/section-loader/SectionLoader';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './primaryGrid.module.scss';
import { TabHeaderHeightContext } from '../../../providers/TabHeaderHeightProvider/tabHeaderHeightContext';

interface Props {
    headers: string[],
    data?: any[],
    isLoading?: boolean, 
    placeholder?: JSX.Element
}

const PrimaryGrid: React.FC<Props> = ({ headers = [], data = [], isLoading, placeholder }) => {
    const { tabHeaderHeight } = useContext(TabHeaderHeightContext)

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