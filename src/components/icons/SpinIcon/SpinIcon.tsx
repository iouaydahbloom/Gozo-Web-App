import { IonIcon } from "@ionic/react"
import { Icon } from "../icon"

interface Props extends Icon {
}

const SpinIcon: React.FC<Props> = ({color, size, className}) => {
    return (
        <IonIcon icon='assets/icon/spin-icon.svg' className={className} color={color} size={size}/>
    )
}

export default SpinIcon