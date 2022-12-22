import { useEffect, useState } from 'react';
import { networkResponseCode } from '../../constants/networkResponseCode';
import useToast from '../../hooks/useToast';
import { errorHandlerContext } from './errorHandlerContext';

const ErrorHandlerProvider: React.FC = ({ children }) => {

    const [globalError, setGlobalError] = useState<any>();
    const { presentFailure } = useToast();

    function handleError() {
        if (!globalError) return;

        console.log('globalError ', globalError)
        if (globalError.code === networkResponseCode.timeOut) {
            presentFailure('Network Connection Issue, Please try again!');
        }
    }

    useEffect(() => {
        handleError();
    }, [globalError])

    return (
        <errorHandlerContext.Provider value={{ globalError, setGlobalError }}>
            {children}
        </errorHandlerContext.Provider>
    )
}

export { ErrorHandlerProvider }

