import { IonButton } from '@ionic/react';
import React, { ReactNode, useMemo } from 'react';
import styles from './primaryButton.module.scss';

interface Props {
    children: ReactNode,
    onClick?: () => void,
    size?: 's' | 'm' | 'l',
    expand?: 'block',
    type?: 'primary' | 'dark' | 'success' | 'link',
    customStyles?: string,
    disabled?: boolean,
    fill?: "clear" | "default" | "outline" | "solid" | undefined
}

const PrimaryButton: React.FC<Props> = ({
    children,
    onClick,
    size = 'l',
    expand,
    type = 'primary',
    customStyles = '',
    disabled = false,
    fill=undefined
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

    const styledColor = useMemo(() => {
        let selectedColor;
        switch (type) {
            case 'primary':
                selectedColor = styles.small;
                break;
            case 'success':
                selectedColor = styles.success;
                break;
            case 'dark':
                selectedColor = styles.dark;
                break;
            case 'link':
                selectedColor = styles.link;
                break;
            default:
                selectedColor = styles.primary;
                break;
        }

        return selectedColor;
    }, [type])

    return (
        <IonButton
            expand={expand}
            className={`${styles.button} ${styledSize} ${customStyles} ${styledColor} ${fill === 'outline' ? styles.outline : ''}`}
            onClick={onClick}
            fill={fill}
            disabled={disabled}>
            {children}
        </IonButton>
    )
}

export default PrimaryButton;