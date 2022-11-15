import { IonInput } from '@ionic/react';
import React from 'react';
import styles from './secondaryInput.module.scss';

interface Props {
    placeholder?: string,
    value: string,
    onChange: any,
    name?: string,
    disabled?: boolean,
    className?: string
}

const SecondaryInput: React.FC<Props> = ({ placeholder, value, onChange, name, disabled = false, className }) => {
    return (
        <IonInput
            name={name}
            className={`${styles.input} ${className}`}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onIonChange={onChange} />
    )
}

export default SecondaryInput;