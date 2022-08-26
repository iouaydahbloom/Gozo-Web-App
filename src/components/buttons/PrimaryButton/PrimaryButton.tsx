import { IonButton } from '@ionic/react';
import React, { ReactNode, useMemo } from 'react';
import styles from './primaryButton.module.scss';

interface Props {
    children: ReactNode,
    onClick?: () => void,
    size?: 's' | 'm' | 'l',
    expand?: 'block'
}

const PrimaryButton: React.FC<Props> = ({ children, onClick, size = 'l', expand }) => {

    const styledSize = useMemo(() => {
        let selectedStyle;
        switch (size) {
            case 's':
                selectedStyle = styles.small;
                break;
            case 'm':
                selectedStyle = styles.medium;
                break;
            case 'l':
                selectedStyle = styles.large;
                break;
            default:
                selectedStyle = styles.large;
                break;
        }

        return selectedStyle;
    }, [size])

    return (
        <IonButton
            color='primary'
            expand={expand}
            className={`${styles.button} ${styledSize}`}
            onClick={onClick}>
            {children}
        </IonButton>
    )
}

export default PrimaryButton