import { IonInput } from '@ionic/react';
import React from 'react';
import styles from './primaryInput.module.scss';

interface Props {
    placeholder?: string,
    value: string,
    onChange: (value: string) => void,
    className?: string
}

const PrimaryInput: React.FC<Props> = ({ placeholder, value, onChange, className }) => {
    return (
        <IonInput
            className={`${styles.input} ${className}`}
            placeholder={placeholder}
            value={value}
            onIonChange={(event) => onChange(event.detail.value ?? '')} />
    )
}

export default PrimaryInput;