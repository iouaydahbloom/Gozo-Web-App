import { IonButton, IonButtons, IonIcon, IonToolbar, IonTitle } from '@ionic/react'
import { closeOutline } from 'ionicons/icons'
import { ReactElement } from 'react'
import styles from './primaryModalToolbar.module.scss'

interface Props {
    title: string,
    onClick: () => void,
    icon?: ReactElement | null,
    color?: string
}

const PrimaryModalToolbar: React.FC<Props> = ({ title, icon, onClick, color = 'medium' }) => {
    return (
        <IonToolbar className={styles.primaryModalToolbar} color={color} mode='ios'>
            <IonTitle className={styles.title}>{title}</IonTitle>
            <IonButtons slot="end" className={styles.toolbarEndSlot}>
                <IonButton onClick={onClick}>
                    {icon ?
                        icon
                        :
                        <IonIcon slot="icon-only" icon={closeOutline} color='light' size="large"/>
                    }
                </IonButton>
            </IonButtons>
        </IonToolbar>
    )
}

export default PrimaryModalToolbar;