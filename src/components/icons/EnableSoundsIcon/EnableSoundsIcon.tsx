import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const EnableSoundsIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/enable-sound.svg' color={color} size={size} />
    )
}

const EnableSoundsIcon = memo(EnableSoundsIconComponent);
export default EnableSoundsIcon;