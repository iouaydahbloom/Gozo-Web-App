import { IonItem, IonLabel } from "@ionic/react"
import { Reward } from "../../../models/reward"
import styles from "./rewardListingItem.module.scss"

interface Props {
  reward: Reward,
  lines?: 'none' | 'full',
}

const RewardListingItem: React.FC<Props> = ({ reward, lines }) => {
  return (
    <IonItem className={`${styles.rewardListingItem} ion-text-center ion-padding-horizontal`} lines={lines}>
      <IonLabel>
        <img src={reward.icon} className={styles.prizeImage} />
      </IonLabel>
      <IonLabel className={styles.textWrapper}>{reward.name}</IonLabel>
      <IonLabel>{reward.date}</IonLabel>
    </IonItem>
  )
}

export default RewardListingItem