import React, { ReactNode } from 'react';
import PullToRefresh from 'react-simple-pull-to-refresh';

interface Props {
    children: ReactNode,
    onRefresh?: () => Promise<any>
}

const PageRefresher: React.FC<Props> = ({ children, onRefresh = Promise.resolve }) => {
    return (
        <PullToRefresh onRefresh={onRefresh}>
            <div>
                {children}
            </div>
        </PullToRefresh>
    )
}

export default PageRefresher;