import { IonText } from '@ionic/react';
import React, { ReactNode, useCallback, useMemo } from 'react';
import styles from './primaryTypography.module.scss';

interface Props {
    children?: ReactNode,
    isBlock?: boolean,
    isBold?: boolean,
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl',
    customClassName?: string,
    color?: 'light' | 'dark' | 'danger'
}

const PrimaryTypography: React.FC<Props> = ({
    children,
    isBlock = true,
    isBold = false,
    size = 's',
    customClassName = '',
    color = 'light'
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
            case 'xl':
                selectedStyle = styles.xl;
                break;
            case 'xxl':
                selectedStyle = styles.xxl;
                break;
            default:
                selectedStyle = styles.small;
                break;
        }

        return selectedStyle;
    }, [size])

    return (
        <IonText
            color={color}
            className={`
            ${styles.text} 
            ${isBlock ? styles.block : ''} 
            ${styledSize}
             ${isBold ? styles.bold : ''} 
             ${customClassName}
             `}>
            {children}
        </IonText>
    )
}

export default PrimaryTypography;