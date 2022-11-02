import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const DashboardIconComponent: React.FC<IconProps> = ({ color, size, isFilled }) => {
    return (
        <IonIcon
            icon={isFilled ? 'assets/icon/dashboard-filled.svg' : 'assets/icon/dashboard.svg'}
            color={color}
            size={size} />
    )
}

const DashboardIcon = memo(DashboardIconComponent);
export default DashboardIcon;