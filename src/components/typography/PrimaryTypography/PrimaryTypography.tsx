import { IonText } from '@ionic/react';
import React, { ReactNode, useCallback, useMemo } from 'react';
import styles from './primaryTypography.module.scss';

interface Props {
    children?: ReactNode,
    isBlock?: boolean,
    isBold?: boolean,
    size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl',
    customClassName?: string
}

const PrimaryTypography: React.FC<Props> = ({
    children,
    isBlock = true,
    isBold = false,
    size = 's',
    customClassName = ''
}) => {

    const styledSize = useMemo(() => {
        let selectedStyle;
        switch (size) {
            case 's':
                selectedStyle = styles.small;
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
            color='light'
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