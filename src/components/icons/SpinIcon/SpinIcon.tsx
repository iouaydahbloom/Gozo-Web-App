import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const SpinIconComponent: React.FC<IconProps> = ({ color, size, className, isFilled }) => {
    return (
        <IonIcon
            icon={isFilled ? 'assets/icon/play-filled.svg' : 'assets/icon/play.svg'}
            className={className}
            color={color}
            size={size} />
    )
}

const SpinIcon = memo(SpinIconComponent);
export default SpinIcon;