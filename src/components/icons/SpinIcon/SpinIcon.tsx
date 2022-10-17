import { IonIcon } from "@ionic/react"
import { IconProps } from "../iconProps"

const SpinIcon: React.FC<IconProps> = ({color, size, className}) => {
    return (
        <IonIcon icon='assets/icon/spin-icon.svg' className={className} color={color} size={size}/>
    )
}

export default SpinIcon