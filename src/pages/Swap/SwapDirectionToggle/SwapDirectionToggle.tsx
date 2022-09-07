import { IonIcon } from "@ionic/react";
import { arrowDownOutline, swapVerticalOutline } from "ionicons/icons";
import styles from './swapDirectionToggle.module.scss';

interface Props {
    doubleDirection?: boolean,
    onClick?: () => void
}

const SwapDirection: React.FC<Props> = ({ doubleDirection = false, onClick }) => {
    return (
        <div className={styles.swipeDirection} onClick={onClick}>
            <IonIcon
                className={styles.icon}
                icon={doubleDirection ? swapVerticalOutline : arrowDownOutline}
                color='light' />
        </div>
    )
}

export default SwapDirection;