import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react"
import { star } from "ionicons/icons"
import { Reward } from "../../../models/reward"
import styles from "./rewardListingItem.module.scss"

interface Props {
  reward: Reward,
  lines?: 'none' | 'full',
}

const RewardListingItem: React.FC<Props> = ({ reward, lines }) => {
  return (
    <IonItem className={`${styles.rewardListingItem} ion-text-center`} lines={lines}>
      <IonLabel>
      <IonIcon icon={star}></IonIcon>
      </IonLabel>
      <IonLabel>{reward.name}</IonLabel>
      <IonLabel>{reward.date}</IonLabel>
    </IonItem>
  )
}

export default RewardListingItem