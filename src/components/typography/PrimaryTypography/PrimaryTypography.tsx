import { IonText } from '@ionic/react';
import { StyleReactProps } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import React, { CSSProperties, ReactNode, useCallback, useMemo } from 'react';
import styles from './primaryTypography.module.scss';

interface Props {
    children?: ReactNode,
    isBlock?: boolean,
    isBold?: boolean,
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl',
    customClassName?: string,
    color?: 'light' | 'dark' | 'danger' | 'medium' | 'medium-light' | 'success' | 'slightly-light' | 'quaternary'
    style?: CSSProperties
}

const PrimaryTypography: React.FC<Props> = ({
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