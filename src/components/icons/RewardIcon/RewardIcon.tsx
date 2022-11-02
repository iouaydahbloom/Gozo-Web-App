import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const RewardIconComponent: React.FC<IconProps> = ({ color, size, isFilled }) => {
    return (
        <IonIcon
            icon={isFilled ? 'assets/icon/rewards-filled.svg' : 'assets/icon/rewards.svg'}
            color={color}
            size={size} />
    )
}

const RewardIcon = memo(RewardIconComponent);
export default RewardIcon;