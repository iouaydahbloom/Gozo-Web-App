import React, { ReactNode } from 'react'
import styles from './formField.module.scss'

interface Props {
    children: ReactNode | string,
    contentDisplay?: 'block' | 'flex'
}

export const FormField: React.FC<Props> = ({ children, contentDisplay = 'block' }) => {
    return (
        <div className={styles.formField} style={{ display: contentDisplay }}>
            {children}
        </div>
    )
}
