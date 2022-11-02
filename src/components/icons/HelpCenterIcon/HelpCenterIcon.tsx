import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const HelpCenterIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/help-center.svg' color={color} size={size} />
    )
}

const HelpCenterIcon = memo(HelpCenterIconComponent);
export default HelpCenterIcon;