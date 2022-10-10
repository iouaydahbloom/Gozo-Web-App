import { IonButtons } from '@ionic/react';
import React, { ReactNode } from 'react'
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import styles from './primaryButtonsGroup.module.scss';

interface Props {
    className?: string
    buttons?: {
        children?: ReactNode,
        label?: string,
        fill?: "clear" | "default" | "outline" | "solid" | undefined,
        onClick: () => void
    }[]
}

const PrimaryButtonsGroup: React.FC<Props> = ({ className = '', buttons = [] }) => {
    return (
        <div className={`${styles.buttonsContainer} ${className}`}>
            {buttons.map((button, index) => (
                <div key={index}
                    className={styles.buttonContainer}>
                    <PrimaryButton
                        onClick={button.onClick}
                        customStyles={styles.button}
                        fill={button.fill}
                    >
                        {button.children}
                    </PrimaryButton>
                    <PrimaryTypography>{button.label}</PrimaryTypography>
                </div>
            ))}
        </div>
    )
}

export default PrimaryButtonsGroup;