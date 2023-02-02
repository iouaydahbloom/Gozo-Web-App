import React, { ReactNode } from 'react';
import styles from './secondaryCard.module.scss';

interface Props {
    children: ReactNode,
    className?: string
}

const SecondaryCard: React.FC<Props> = ({ children, className }) => {
    return (
        <div className={`${styles.container} ${className}`}> {children}</div >
    )
}

export default SecondaryCard;