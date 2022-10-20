import { IonContent } from '@ionic/react'
import React from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography'
import styles from './spinConditionModal.module.scss'

interface Props {
    setSpinWheel: React.Dispatch<React.SetStateAction<boolean>>,
    dismiss: () => void,
    cost?: number
}

const SpinCondition: React.FC<Props> = ({ setSpinWheel, dismiss, cost }) => {
    return (
        <IonContent className={`${styles.container} ion-text-center ion-padding`}>
            <div className={styles.containerContent}>
                <PrimaryTypography
                    size='m'
                >
                    {cost} points will be redeemed from your account
                </PrimaryTypography>

                <PrimaryButton onClick={() => { dismiss(); setSpinWheel(true) }} size='m' expand='block'>
                    confirm
                </PrimaryButton>
                <PrimaryButton fill='clear' type='link' onClick={() => dismiss()} size='m' expand='block'>
                    cancel
                </PrimaryButton>
            </div>
        </IonContent>
    )
}

export default SpinCondition