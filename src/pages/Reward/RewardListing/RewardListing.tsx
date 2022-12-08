import { Reward } from "../../../models/reward"
import RewardListingItem from "../RewardListingItem/RewardListingItem"
import styles from "./rewardListing.module.scss"

interface Props {
    rewards: Reward[],
    reload: () => void
}

const RewardListing: React.FC<Props> = ({ rewards, reload }) => {
    return (
        <div className={`${styles.rewardListing}`}>
            {rewards.length !== 0 &&
                rewards.map((reward, index) => (
                    <RewardListingItem 
                        key={index} 
                        reward={reward} 
                        reload={reload}
                        />
                ))
            }
        </div>
    )
}

export default RewardListing