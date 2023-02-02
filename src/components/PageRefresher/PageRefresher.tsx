import React, { ReactNode } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';

interface Props {
    children: ReactNode,
    onRefresh?: () => Promise<any>,
    className?: string
}

const PageRefresher: React.FC<Props> = ({ children, onRefresh = Promise.resolve, className }) => {
    return (
        <PullToRefresh className={className} onRefresh={onRefresh}>
            <div>
                {children}
            </div>
        </PullToRefresh>
    )
}

export default PageRefresher;