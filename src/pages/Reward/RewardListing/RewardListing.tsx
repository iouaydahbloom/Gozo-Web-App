import { IonList } from "@ionic/react"
import { Reward } from "../../../models/reward"
import RewardListingItem from "../RewardListingItem/RewardListingItem"
import styles from "./rewardListing.module.scss"

interface Props {
    rewards: Reward[]
}

const RewardListing: React.FC<Props> = ({ rewards }) => {
    return (
        <IonList className={`${styles.rewardListing}`} inset={true} lines="full">
            {rewards.length !== 0 &&
                rewards.map((reward, index) => (
                    <RewardListingItem 
                        key={index} 
                        reward={reward} 
                        // lines={rewards.length - 1 === index ? 'none' : 'full'}
                        />
                ))
            }
        </IonList>
    )
}

export default RewardListing