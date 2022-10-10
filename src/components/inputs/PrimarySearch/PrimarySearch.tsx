import { IonSearchbar } from '@ionic/react';
import React from 'react';
import styles from './primarySearch.module.scss';

interface Props {
    value?: string,
    onChange?: (value: string) => void,
    placeholder?: string
}

const PrimarySearch: React.FC<Props> = ({ value, onChange, placeholder = 'Search' }) => {
    return (
        <IonSearchbar
            className={styles.input}
            placeholder={placeholder}
            value={value}
            onIonChange={(event) => {
                onChange && onChange(event.detail.value ?? '')
            }} />
    )
}

export default PrimarySearch;