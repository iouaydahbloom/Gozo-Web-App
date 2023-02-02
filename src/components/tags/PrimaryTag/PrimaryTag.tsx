import { IonChip } from '@ionic/react'
import { defaultColorType } from '../../../types/defaultColorType'
import styles from './primaryTag.module.scss'

interface Props {
    children: React.ReactNode | string,
    backgroundColor?: defaultColorType,
    className?: string
    color?: defaultColorType
}

const PrimaryTag: React.FC<Props> = ({ className, children, backgroundColor="tertiary", color="light" }) => {
    return (
        <IonChip color={color} style={{background: `var(--ion-color-${backgroundColor})`}} className={`${styles.primaryTag} ${className}`}>
            {children}
        </IonChip>
    )
}

export default PrimaryTag;
