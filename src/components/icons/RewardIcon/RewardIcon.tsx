import { IonIcon } from "@ionic/react"

interface Props {
    color?: string,
    size?: string
}

const RewardIcon: React.FC<Props> = ({color, size}) => {
    return (
        <IonIcon icon='assets/icon/rewards-icon.svg' color={color} size={size}/>
    )
}

export default RewardIcon