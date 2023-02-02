import React, { ReactNode } from 'react';
import styles from './bottomFixedContainer.module.scss';

interface Props {
    children: ReactNode
}

const BottomFixedContainer: React.FC<Props> = ({ children }) => {
    return (
        <div className={styles.container}>{children}</div>
    )
}

export default BottomFixedContainer;