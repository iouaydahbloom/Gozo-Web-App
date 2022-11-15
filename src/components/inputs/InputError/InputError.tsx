import React from 'react'
import styles from './inputError.module.scss'

interface Props {
    error: string
}

const InputError: React.FC<Props> = ({ error }) => {
    return (
        <div className={styles.inputError}>{error}</div>
    )
}

export default InputError;
