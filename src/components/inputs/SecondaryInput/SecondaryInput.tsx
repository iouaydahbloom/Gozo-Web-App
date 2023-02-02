import { IonInput } from '@ionic/react';
import React from 'react';
import styles from './secondaryInput.module.scss';

interface Props {
    placeholder?: string,
    value: string | number,
    onChange: any,
    name?: string,
    disabled?: boolean,
    className?: string,
    type?: 'text' | 'number',
    min?: any
}

const SecondaryInput: React.FC<Props> = ({ placeholder, value, onChange, name, disabled = false, className, type = 'text', min }) => {
    return (
        <IonInput
            name={name}
            className={`${styles.input} ${className}`}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onIonChange={onChange}
            type={type}
            min={min} />
    )
}

export default SecondaryInput;