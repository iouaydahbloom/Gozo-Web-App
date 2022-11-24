import { useCallback, useEffect, useState } from 'react';
import { TIME_OUT_CODE } from '../../helpers/http/http-config';
import useToast from '../../hooks/useToast';
import { errorHandlerContext } from './errorHandlerContext';

const ErrorHandlerProvider: React.FC = ({ children }) => {

    const [error, setError] = useState<any>();
    const { presentFailure } = useToast();

    const handleError = useCallback(() => {
        if (error?.code == TIME_OUT_CODE) {
            presentFailure('Network Connection Issue, Please try again!');
        }
    }, [error])

    useEffect(() => {
        handleError();
    }, [error])

    return (
        <errorHandlerContext.Provider value={{ error, setError }}>
            {children}
        </errorHandlerContext.Provider>
    )
}

export { ErrorHandlerProvider }

