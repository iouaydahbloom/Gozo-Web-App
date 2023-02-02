import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const LogoutIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/log-out.svg' color={color} size={size} />
    )
}

const LogoutIcon = memo(LogoutIconComponent);
export default LogoutIcon;