import { IonIcon } from "@ionic/react"
import { memo } from "react";
import { IconProps } from "../iconProps"

const TransactionHistoryIconComponent: React.FC<IconProps> = ({ color, size }) => {
    return (
        <IonIcon icon='assets/icon/transaction-history.svg' color={color} size={size} />
    )
}

const TransactionHistoryIcon = memo(TransactionHistoryIconComponent);
export default TransactionHistoryIcon;