import { IonInput } from '@ionic/react';
import React from 'react';
import styles from './primaryInput.module.scss';

interface Props {
    placeholder?: string,
    value: string,
    onChange: (value: string) => void,
    name?: string,
    id?: string,
    disabled?: boolean,
    className?: string,
    type?: any
}

const PrimaryInput: React.FC<Props> = ({ placeholder, value, onChange, name, id, type = "text", disabled = false, className }) => {
    return (
        <IonInput
            name={name}
            className={`${styles.input} ${className}`}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            id={id}
            value={value}
            onIonChange={(event) => onChange(event.detail.value ?? '')} />
    )
}

export default PrimaryInput;