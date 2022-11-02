import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const ProfileIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/profile-details.svg' color={color} size={size} />
    )
}

const ProfileIcon = memo(ProfileIconComponent);
export default ProfileIcon;