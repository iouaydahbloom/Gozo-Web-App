import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const ClipboardComponent: React.FC<IconProps> = ({ color, size, className }) => {
    return (
        <IonIcon
            icon='assets/icon/clipboard.svg'
            className={className}
            color={color}
            size={size} />
    )
}

const ClipboardIcon = memo(ClipboardComponent);
export default ClipboardIcon;