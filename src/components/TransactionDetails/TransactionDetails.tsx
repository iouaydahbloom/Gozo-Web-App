import { IonSpinner } from '@ionic/react';
import React from 'react';
import PrimaryTypography from '../typography/PrimaryTypography/PrimaryTypography';
import styles from './transactionDetails.module.scss';

interface Props {
    showFeeEstimation: boolean,
    isEstimatingFee: boolean,
    estimatedFee?: number,
    estimatedFeeUnit?: string,
    hasMinimumValue: boolean,
    minimumValue?: number,
    notification?: string
}

const TransactionDetails: React.FC<Props> = ({
    showFeeEstimation,
    isEstimatingFee,
    estimatedFee,
    estimatedFeeUnit,
    hasMinimumValue,
    minimumValue,
    notification
}) => {
    return (
        <div className={styles.cryptoTransactionDetails}>
            {
                showFeeEstimation && <div className={styles.gasFeeContainer}>
                    <PrimaryTypography customClassName={styles.gasFeeTitle} isBold>Gas Fee</PrimaryTypography>
                    <PrimaryTypography customClassName={styles.gasFeeValue} isBold>
                        {isEstimatingFee ?
                            <IonSpinner color='light' className={styles.spinner} /> :
                            estimatedFee} {estimatedFeeUnit}
                    </PrimaryTypography>
                </div>
            }
            {hasMinimumValue && showFeeEstimation && <div className={styles.seperator} />}
            {
                hasMinimumValue && <>
                    <PrimaryTypography isBold customClassName={styles.title}>Minimum Value</PrimaryTypography>
                    <PrimaryTypography>
                        Make sure to that you enter an amount higher than <strong>{minimumValue}</strong>
                    </PrimaryTypography>
                </>
            }
            {notification && (hasMinimumValue || showFeeEstimation) && <div className={styles.seperator} />}
            {
                notification && <>
                    <PrimaryTypography isBold customClassName={styles.title}>Notification</PrimaryTypography>
                    <PrimaryTypography>
                        {notification}
                    </PrimaryTypography>
                </>
            }
        </div>
    )
}

export default TransactionDetails;