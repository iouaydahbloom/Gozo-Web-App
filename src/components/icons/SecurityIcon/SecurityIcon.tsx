import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const SecurityIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/security.svg' color={color} size={size} />
    )
}

const SecurityIcon = memo(SecurityIconComponent);
export default SecurityIcon;