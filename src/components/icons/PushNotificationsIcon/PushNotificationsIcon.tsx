import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const PushNotificationsIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/enable-push-notifications.svg' color={color} size={size} />
    )
}

const PushNotificationsIcon = memo(PushNotificationsIconComponent);
export default PushNotificationsIcon;