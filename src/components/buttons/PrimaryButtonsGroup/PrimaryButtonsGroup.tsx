import { IonButtons } from '@ionic/react';
import React, { ReactNode } from 'react'
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import styles from './primaryButtonsGroup.module.scss';

interface Props {
    buttons?: {
        icon: ReactNode,
        title: string,
        onClick: () => void
    }[]
}

const PrimaryButtonsGroup: React.FC<Props> = ({ buttons = [] }) => {
    return (
        <div className={styles.buttonsContainer}>
            {buttons.map((button, index) => (
                <div key={index}
                    className={styles.buttonContainer}>
                    <PrimaryButton
                        onClick={button.onClick}
                        customStyles={styles.button}
                    >
                        {button.icon}
                    </PrimaryButton>
                    <PrimaryTypography>{button.title}</PrimaryTypography>
                </div>
            ))}
        </div>
    )
}

export default PrimaryButtonsGroup;