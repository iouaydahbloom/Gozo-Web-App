import { IonButtons } from '@ionic/react';
import React, { ReactNode } from 'react'
import PrimaryButton from '../PrimaryButton/PrimaryButton';

interface Props {
    buttons?: {
        icon: ReactNode,
        title: string,
        onClick: () => void
    }[]
}

const PrimaryButtonsGroup: React.FC<Props> = ({ buttons = [] }) => {
    return (
        <IonButtons>
            {
                buttons.map((button, index) => (
                    <>
                        <PrimaryButton key={`button-${index}`}>{button.icon}</PrimaryButton>
                        {button.title}
                    </>
                ))
            }
        </IonButtons>
    )
}

export default PrimaryButtonsGroup;