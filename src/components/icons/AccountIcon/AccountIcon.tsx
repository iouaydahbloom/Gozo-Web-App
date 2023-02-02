import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const AccountIconComponent: React.FC<IconProps> = ({ color, size, isFilled }) => {
    return (
        <IonIcon
            icon={isFilled ? 'assets/icon/account-filled.svg' : 'assets/icon/account.svg'}
            color={color}
            size={size} />
    )
}

const AccountIcon = memo(AccountIconComponent);
export default AccountIcon;