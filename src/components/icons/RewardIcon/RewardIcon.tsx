import { IonIcon } from "@ionic/react"
import { IconProps } from "../iconProps"

const RewardIcon: React.FC<IconProps> = ({color, size}) => {
    return (
        <IonIcon icon='assets/icon/rewards-icon.svg' color={color} size={size}/>
    )
}

export default RewardIcon