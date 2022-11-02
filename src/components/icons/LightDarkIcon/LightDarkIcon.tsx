import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const LightDarkIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/dark-mode.svg' color={color} size={size} />
    )
}

const LightDarkIcon = memo(LightDarkIconComponent);
export default LightDarkIcon;