import { IonPage } from '@ionic/react';
import React, { useEffect } from 'react'
import PrimaryContainer from '../../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryLoader from '../../../components/loaders/PrimaryLoader/PrimaryLoader';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import useAuthentication from '../../../hooks/useAuthentication';
import useSearchParams from '../../../hooks/useSearchParams';
import useTabMenuHidder from '../../../hooks/useTabMenuHidder';

const AuthCallback: React.FC = () => {

    const { login, authError } = useAuthentication();
    const search = useSearchParams();
    useTabMenuHidder();

    useEffect(() => {
        const credentials = search.get('token');
        const oneTimeToken = search.get('ott');
        console.log('creds are and ott is', credentials, oneTimeToken)
        if (credentials || oneTimeToken) {
            if (credentials) login(credentials);
            else if (oneTimeToken) login(`?didt=${oneTimeToken}`);
        }
    }, [search])

    return (
        <IonPage>
            <PrimaryContainer>
                <PrimaryLoader />
                {authError && <PrimaryTypography color='danger'>{authError}</PrimaryTypography>}
            </PrimaryContainer>
        </IonPage>
    )
}

export default AuthCallback;