import { IonIcon } from "@ionic/react"

interface Props {
    color?: string,
    size?: string
}

const SpinIcon: React.FC<Props> = ({color, size}) => {
    return (
        <IonIcon icon='assets/icon/spin-icon.svg' color={color} size={size}/>
    )
}

export default SpinIcon