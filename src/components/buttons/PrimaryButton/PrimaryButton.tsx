import { IonButton } from '@ionic/react';
import React, { ReactNode, useMemo } from 'react';
import styles from './primaryButton.module.scss';

interface Props {
    children: ReactNode,
    onClick?: () => void,
    size?: 's' | 'm' | 'l',
    expand?: 'block',
    type?: 'primary' | 'dark' | 'success',
    customStyles?: string,
    disabled?: boolean
}

const PrimaryButton: React.FC<Props> = ({
    children,
    onClick,
    size = 'l',
    expand,
    type = 'primary',
    customStyles = '',
    disabled = false
}) => {

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
            expand={expand}
            className={`${styles.button} ${styledSize} ${customStyles} ${type}`}
            onClick={onClick}
            disabled={disabled}>
            {children}
        </IonButton>
    )
}

export default PrimaryButton;