import React, { ReactNode } from 'react'
import { useMoralis } from 'react-moralis';
import { Redirect, Route } from 'react-router-dom';
import { AppRoutes } from '../../../constants/appRoutes';

interface Props {
    children: ReactNode
}

const ProtectedRoutes: React.FC<Props & Record<any, any>> = ({ children, ...restOfProps }) => {

    const { isAuthenticated } = useMoralis();

    return (
        isAuthenticated ?
            <Route {...restOfProps}>{children}</Route> :
            <Redirect to={AppRoutes.landing} />
    )
}

export default ProtectedRoutes;