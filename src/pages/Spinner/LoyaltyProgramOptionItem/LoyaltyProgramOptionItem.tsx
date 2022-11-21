import { IonAvatar, IonItem, IonLabel, IonRadio } from "@ionic/react"
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import useMemberShip from "../../../hooks/useMembership"
import styles from './loyaltyProgramOptionItem.module.scss'

interface Props {
    name: string,
    currency: string,
    icon: string,
    isActive: boolean,
    onClick: (name: string) => void
}

const LoyaltyProgramOptionItem: React.FC<Props> = ({ name, currency, icon, isActive, onClick }) => {

    const { membership } = useMemberShip(currency);

    return (
        <IonItem lines='none' className={`${styles.container} ${isActive ? styles.active : ''}`} onClick={() => onClick(name)}>
            <IonRadio value={name} className={styles.selector}></IonRadio>
            <IonAvatar>
                <img src={icon} />
            </IonAvatar>
            <IonLabel className={styles.info}>
                <IonLabel color='light'>
                    <PrimaryTypography size='m' isBlock={false}>
                        {name}
                    </PrimaryTypography>
                </IonLabel>
                <IonLabel className={styles.balanceWrapper}>
                    <PrimaryTypography customClassName={styles.balance} isBlock={false} size='m'>
                        Bal. 
                    </PrimaryTypography>
                    <PrimaryTypography customClassName="ellipsis" isBlock={false} size='m'>
                        {membership?.balance} Units
                    </PrimaryTypography>
                </IonLabel>
            </IonLabel>
        </IonItem>
    )
}

export default LoyaltyProgramOptionItem