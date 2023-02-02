import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const BuyIconComponent: React.FC<IconProps> = ({ color, size, isFilled }) => {
    return (
        <IonIcon
            icon={isFilled ? 'assets/icon/buy-filled.svg' : 'assets/icon/buy.svg'}
            color={color}
            size={size} />
    )
}

const BuyIcon = memo(BuyIconComponent);
export default BuyIcon;