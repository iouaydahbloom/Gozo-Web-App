import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const ReferFriendsIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/refer-to-a-friend.svg' color={color} size={size} />
    )
}

const ReferFriendsIcon = memo(ReferFriendsIconComponent);
export default ReferFriendsIcon;