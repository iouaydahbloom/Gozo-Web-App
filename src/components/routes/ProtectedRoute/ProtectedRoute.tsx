import React, { ReactNode } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppRoutes } from '../../../constants/appRoutes';
import useAuthentication from '../../../hooks/useAuthentication/useAuthentication';

interface Props {
    children: ReactNode
}

const ProtectedRoute: React.FC<Props & Record<any, any>> = ({ children, ...restOfProps }) => {

    const { isAuthenticated } = useAuthentication();

    return (
        isAuthenticated ?
            <Route {...restOfProps}>{children}</Route> :
            <Redirect to={AppRoutes.landing} />
    )
}

export default ProtectedRoute;