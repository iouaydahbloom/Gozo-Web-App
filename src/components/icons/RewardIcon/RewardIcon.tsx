import { IonIcon } from "@ionic/react"
import { Icon } from "../icon"

interface Props extends Icon {
}

const RewardIcon: React.FC<Props> = ({color, size}) => {
    return (
        <IonIcon icon='assets/icon/rewards-icon.svg' color={color} size={size}/>
    )
}

export default RewardIcon