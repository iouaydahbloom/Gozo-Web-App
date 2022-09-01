import { IonIcon } from "@ionic/react";
import { arrowDownOutline } from "ionicons/icons";
import styles from './swapDirectionToggle.module.scss';

const SwapDirection = () => {
    return (
        <div className={styles.swipeDirection}>
            <IonIcon
                className={styles.icon}
                icon={arrowDownOutline}
                color='light' />
        </div>
    )
}

export default SwapDirection;