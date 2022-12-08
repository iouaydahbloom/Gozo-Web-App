import { IonButton, IonButtons, IonIcon } from "@ionic/react"
import { informationCircleOutline } from "ionicons/icons"
import PrimaryButton from "../../../components/buttons/PrimaryButton/PrimaryButton"
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import { formatDate } from "../../../helpers/dateManagment"
import usePopover from "../../../hooks/usePopover"
import usePrimarySheet from "../../../hooks/usePrimarySheet"
import { Reward } from "../../../models/reward"
import ClaimReward from "../ClaimReward/ClaimReward"
import styles from "./rewardListingItem.module.scss"
import { modalController } from '@ionic/core';

interface Props {
  reward: Reward,
  reload?: () => void
}

const RewardListingItem: React.FC<Props> = ({ reward, reload }) => {

  const { showModal: showClaimReward } = usePrimarySheet({
    title: 'Claim Details',
    component: ClaimReward,
    componentProps: {prizeId: reward.prizeId, rewardId: reward.id, dismiss: dismissModal},
    id: 'claimModal',
    onDismiss: () => {
      reload && reload()
    }
  })

  function dismissModal() {
    modalController.dismiss(null, undefined, "claimModal");
}

  const { showPopover } = usePopover({
    id: reward.id,
    content:
      <div>
        <div className={styles.popoverRow}>
          <PrimaryTypography color="medium-light">
            Id:
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
        {reward.status === 'pending' ?
          <PrimaryButton size="s" onClick={showClaimReward}>claim</PrimaryButton>
          :
          reward.status
        }
      </PrimaryTypography>
    </div>
  )
}

export default RewardListingItem