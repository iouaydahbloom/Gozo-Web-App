import React, { useEffect, useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../components/inputs/PrimaryInput/PrimaryInput';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useAuthentication from '../../hooks/useAuthentication/useAuthentication';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import useToast from '../../hooks/useToast';
import styles from './authentication.module.scss';

const Authentication: React.FC = () => {

    const { login, isAuthenticating, authError } = useAuthentication();
    const [email, setEmail] = useState('');
    const { presentFailure } = useToast();

    useTabMenuHidder();

    function authenticate() {
        if (!email) {
            presentFailure('Email address is required');
            return;
        }

        login(email);
    }

    useEffect(() => {
        if (!isAuthenticating && authError) {
            presentFailure(authError);
        }
    }, [authError, isAuthenticating])

    return (
        <div className={styles.container}>
            <PrimaryTypography size='m' customClassName={styles.label}>Email Address</PrimaryTypography>
            <PrimaryInput
                className={styles.input}
                placeholder='Please enter your email address'
                value={email}
                onChange={setEmail} />
            <PrimaryButton
                size='m'
                onClick={authenticate}
                expand='block'
                loading={isAuthenticating}>
                Continue with email
            </PrimaryButton>
        </div>
    )
}

export default Authentication