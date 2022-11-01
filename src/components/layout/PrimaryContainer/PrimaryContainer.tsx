import { IonContent } from '@ionic/react'
import React, { ReactNode } from 'react';
import PageRefresher from '../../PageRefresher/PageRefresher';
import styles from './primaryContainer.module.css';

interface Props {
    children: ReactNode,
    className?: string,
    scrollXAxis?: boolean,
    isRefreshable?: boolean,
    onRefresh?: () => Promise<any>
}

const PrimaryContainer: React.FC<Props> = ({ children, className, scrollXAxis, isRefreshable = false, onRefresh }) => {

    return (
        <IonContent className={`ion-padding ${styles.container} ${className}`} fullscreen scroll-x={scrollXAxis}>
            {
                isRefreshable ?
                    <PageRefresher onRefresh={onRefresh}>
                        {children}
                    </PageRefresher> :
                    children
            }
        </IonContent>
    )
}

export default PrimaryContainer