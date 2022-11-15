import React, { ReactNode } from 'react'
import styles from './formField.module.scss'

interface Props {
    children: ReactNode | string,
    className?: string,
    contentDisplay?: 'block' | 'flex'
}

export const FormField: React.FC<Props> = ({ children, className, contentDisplay = 'block' }) => {
    return (
        <div className={`${styles.formField} ${className}`} style={{ display: contentDisplay }}>
            {children}
        </div>
    )
}
