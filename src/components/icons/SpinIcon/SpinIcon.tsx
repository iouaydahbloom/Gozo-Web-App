import { IonIcon } from "@ionic/react"

interface Props {
    color?: string,
    size?: string,
    className?: string
}

const SpinIcon: React.FC<Props> = ({color, size, className}) => {
    return (
        <IonIcon icon='assets/icon/spin-icon.svg' className={className} color={color} size={size}/>
    )
}

export default SpinIcon