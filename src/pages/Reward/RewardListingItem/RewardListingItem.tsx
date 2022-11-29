import { IonButton, IonButtons, IonIcon } from "@ionic/react"
import { informationCircleOutline } from "ionicons/icons"
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import { formatDate } from "../../../helpers/dateManagment"
import usePopover from "../../../hooks/usePopover"
import { Reward } from "../../../models/reward"
import styles from "./rewardListingItem.module.scss"

interface Props {
  reward: Reward,
}

const RewardListingItem: React.FC<Props> = ({ reward }) => {

  const { showPopover } = usePopover({
    id: reward.id,
    content:
      <div>
        <div className={styles.popoverRow}>
          <PrimaryTypography color="medium-light">
            Spin Id:
          </PrimaryTypography>
          <PrimaryTypography color="dark">{reward.id}</PrimaryTypography>
        </div>
        <div className={styles.popoverRow}>
          <PrimaryTypography color="medium-light">
            Date:
          </PrimaryTypography>
          <PrimaryTypography color="dark">{formatDate(reward.date, 'ddd Do MMM, YYYY')}</PrimaryTypography>
        </div>
        <div className={styles.popoverRow}>
          <PrimaryTypography color="medium-light">
            Time:
          </PrimaryTypography>
          <PrimaryTypography color="dark">{formatDate(reward.date, 'h:mm a')}</PrimaryTypography>
        </div>
      </div>
  })

  return (
    <div className={`${styles.rewardListingItem} ion-text-center ion-padding-horizontal`}>
      <div className={styles.imageWrapper}>
        <img alt='' src={reward.icon} className={styles.prizeImage} />
      </div>
      <PrimaryTypography
        customClassName={styles.textWrapper}>
        {reward.name}
      </PrimaryTypography>
      <IonButtons>
        <IonButton id={reward.id} onClick={(event: any) => showPopover(event)}>
          <IonIcon color="light" icon={informationCircleOutline} />
        </IonButton>
      </IonButtons>
      <PrimaryTypography
        color="success"
        customClassName={styles.endSlot}>
        Claimed
      </PrimaryTypography>
    </div>
  )
}

export default RewardListingItem