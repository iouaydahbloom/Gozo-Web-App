import React from 'react'
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import styles from './secondaryButtonsGroup.module.scss';

interface Props {
    buttons?: {
        title: string,
        onClick: () => void,
        fill?: "clear" | "default" | "outline" | "solid" | undefined
    }[]
}

const SecondaryButtonsGroup: React.FC<Props> = ({ buttons = [] }) => {
    return (
        <div className={styles.buttonsContainer}>
            {buttons.map((button, index) => (
                <div key={index}
                    className={styles.buttonContainer}>
                    <PrimaryButton
                        onClick={button.onClick}
                        customStyles={styles.button}
                        fill={button.fill}
                    >
                        <PrimaryTypography size='m'>{button.title}</PrimaryTypography>
                    </PrimaryButton>
                </div>
            ))}
        </div>
    )
}

export default SecondaryButtonsGroup;