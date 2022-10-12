import React, { useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../components/inputs/PrimaryInput/PrimaryInput';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useAuthentication from '../../hooks/useAuthentication';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import styles from './authentication.module.scss';

const Authentication: React.FC = () => {

    const { login, isAuthenticating, authError } = useAuthentication();
    const [email, setEmail] = useState('');

    useTabMenuHidder();

    return (
        <div className={styles.container}>
            <PrimaryTypography size='m' customClassName={styles.label}>Email Address</PrimaryTypography>
            <PrimaryInput
                className={styles.input}
                placeholder='Please enter your email address'
                value={email}
                onChange={setEmail} />
            {authError && <PrimaryTypography customClassName={styles.error} color='danger'>{authError}</PrimaryTypography>}
            <PrimaryButton
                size='m'
                onClick={() => login(email)}
                expand='block'
                disabled={isAuthenticating}>
                Continue with email
            </PrimaryButton>
        </div>
    )
}

export default Authentication