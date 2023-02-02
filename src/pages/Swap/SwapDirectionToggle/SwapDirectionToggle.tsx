import {IonIcon} from "@ionic/react";
import {arrowDownOutline, swapVerticalOutline} from "ionicons/icons";
import styles from './swapDirectionToggle.module.scss';
import React from "react";

interface Props {
    doubleDirection?: boolean,
    onClick?: () => void,
    disabled?: boolean
}

const SwapDirection: React.FC<Props> = ({doubleDirection = false, onClick, disabled = false}) => {
    return (
        <div
            className={`${styles.swipeDirection} ${disabled ? styles.disabled : null}`}
            onClick={disabled ? () => null : onClick}
            data-testid="swap-direction-testID"
            aria-disabled={disabled}>
            <IonIcon
                className={styles.icon}
                icon={doubleDirection ? swapVerticalOutline : arrowDownOutline}
                color='light'/>
        </div>
    )
}

export default SwapDirection;