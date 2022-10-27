import { IonButton, IonButtons, IonContent, IonIcon } from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import React from 'react'
import PrimaryModalToolbar from '../../../components/modals/PrimaryModal/PrimaryModalToolbar/PrimaryModalToolbar'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography'
import styles from './spinSuccess.module.scss'

interface Props {
    dismiss: () => void,
    text: string
}

const SpinSuccess: React.FC<Props> = ({ dismiss, text }) => {
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
                    size='xxl'
                >
                    LUCKY BONUS!
                </PrimaryTypography>

                <PrimaryTypography
                    size='m'
                >
                    {text}
                </PrimaryTypography>

            </div>
        </IonContent>
    )
}

export default SpinSuccess