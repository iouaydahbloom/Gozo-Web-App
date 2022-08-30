import { IonCheckbox } from '@ionic/react';
import React from 'react'
import styles from './primaryCheckbox.module.scss';

interface Props {
    value?: boolean,
    onChange?: (value: boolean) => void
}

const PrimaryCheckbox: React.FC<Props> = ({ value, onChange }) => {
    return (
        <IonCheckbox
            mode='md'
            className={styles.input}
            value={value}
            checked={value}
            onIonChange={(event) => onChange && onChange(event.detail.checked)} />
    )
}

export default PrimaryCheckbox;