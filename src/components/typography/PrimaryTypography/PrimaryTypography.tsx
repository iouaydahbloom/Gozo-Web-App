import { IonText } from '@ionic/react';
import React, { CSSProperties, ReactNode, useMemo } from 'react';
import { defaultColorType } from '../../../types/defaultColorType';
import styles from './primaryTypography.module.scss';

export interface PrimaryTypographyProps {
    children?: ReactNode,
    isBlock?: boolean,
    isBold?: boolean,
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl',
    customClassName?: string,
    color?: defaultColorType,
    style?: CSSProperties
}

const PrimaryTypography: React.FC<PrimaryTypographyProps> = ({
    children,
    isBlock = true,
    isBold = false,
    size = 's',
    customClassName = '',
    color = 'light',
    style
}) => {

    const styledSize = useMemo(() => {
        let selectedStyle;
        switch (size) {
            case 'xs':
                selectedStyle = styles.xs;
                break;
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
            case 'xxxl':
                selectedStyle = styles.xxxl;
                break;
            default:
                selectedStyle = styles.small;
                break;
        }

        return selectedStyle;
    }, [size])

    return (
        <IonText
        style={style}
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