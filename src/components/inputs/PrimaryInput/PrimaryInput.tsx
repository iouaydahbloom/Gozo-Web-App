import { IonInput } from '@ionic/react';
import React from 'react';
import styles from './primaryInput.module.scss';

interface Props {
    placeholder?: string,
    value: string,
    onChange: (value: string) => void
}

const PrimaryInput: React.FC<Props> = ({ placeholder, value, onChange }) => {
    return (
        <IonInput
            className={styles.input}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value ? event.currentTarget.value.toString() : '')} />
    )
}

export default PrimaryInput;