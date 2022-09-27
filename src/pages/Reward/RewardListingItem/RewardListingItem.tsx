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
    <IonItem className={styles.rewardListingItem} lines={lines} >
      <IonIcon icon={star} slot="start"></IonIcon>
      <IonLabel className="ion-text-wrap ion-padding-horizontal">{reward.name}</IonLabel>
      <IonLabel className="ion-text-wrap">{reward.date}</IonLabel>
    </IonItem>
  )
}

export default RewardListingItem