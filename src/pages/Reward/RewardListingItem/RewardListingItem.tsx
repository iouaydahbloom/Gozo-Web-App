import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import { formatDate } from "../../../helpers/dateManagment"
import usePopover from "../../../hooks/usePopover"
import { Reward } from "../../../models/reward"
import styles from "./rewardListingItem.module.scss"

interface Props {
  reward: Reward,
}

const RewardListingItem: React.FC<Props> = ({ reward }) => {

  const {showPopover} = usePopover({id: reward.id, content: <div><div>Id: {reward.id}</div><div>Description: {reward.name}</div></div>})
  return (
    <div id={reward.id} onClick={(event: any) => showPopover(event)} className={`${styles.rewardListingItem} ion-text-center ion-padding-horizontal`}>
      <div className={styles.imageWrapper}>
        <img src={reward.icon} className={styles.prizeImage} />
      </div>
      <PrimaryTypography
        customClassName={styles.textWrapper}>
        {reward.name}
      </PrimaryTypography>
      <PrimaryTypography
        customClassName={styles.dateWrapper}>
        {formatDate(reward.date)}
      </PrimaryTypography>
    </div>
  )
}

export default RewardListingItem