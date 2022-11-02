import { IonButton, IonButtons, IonContent, IonIcon } from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import React from 'react';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography'
import styles from './spinSuccess.module.scss'

interface Props {
    dismiss: () => void,
    prize?: string
}

const SpinSuccess: React.FC<Props> = ({ dismiss, prize = '' }) => {
    return (
        <IonContent className={`${styles.container} ion-text-center ion-padding`}>
            <div className={styles.containerContent}>
                <IonButtons className={styles.dismiss}>
                    <IonButton onClick={() => dismiss()}>
                        <IonIcon slot="icon-only" icon={closeOutline} color='light' size="large" />
                    </IonButton>
                </IonButtons>
                <img src={'assets/image/confetti.svg'} />

                <PrimaryTypography
                    customClassName={styles.text}
                    size='l'>
                    LUCKY BONUS!
                </PrimaryTypography>

                <PrimaryTypography
                    size='m'
                    color='success'
                    customClassName={styles.reward}>
                    You just won {prize}
                </PrimaryTypography>

                <PrimaryTypography>
                    *You can check your rewards in the Rewards section
                </PrimaryTypography>
            </div>
        </IonContent>
    )
}

export default SpinSuccess