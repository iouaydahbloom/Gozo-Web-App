import React, { useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryCheckbox from '../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import PrimaryInput from '../../components/inputs/PrimaryInput/PrimaryInput';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useAuthentication from '../../hooks/useAuthentication';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import styles from './authentication.module.scss';

const Authentication: React.FC = () => {

    const { login, isAuthenticating, authError } = useAuthentication();
    const [email, setEmail] = useState('');
    const [accepted, setAccepted] = useState(true);
    useTabMenuHidder();

    const TermsAcceptance = () => {
        return (
            <div className={styles.termsContainer}>
                <div className={styles.checkboxField}>
                    <PrimaryCheckbox value={accepted} onChange={setAccepted} />
                </div>
                <PrimaryTypography customClassName={styles.textField}>
                    I’ve read and accepted the <a>Terms of Service</a> and <a>Privacy Policy</a>
                </PrimaryTypography>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <PrimaryInput
                placeholder='Enter your email'
                value={email}
                onChange={setEmail} />
            <br />
            {authError && <PrimaryTypography color='danger'>{authError}</PrimaryTypography>}
            <br />
            <TermsAcceptance />
            <PrimaryButton
                size='m'
                onClick={() => login(email)}
                expand='block'
                disabled={!accepted || isAuthenticating}>
                login / register
            </PrimaryButton>
        </div>
    )
}

export default Authentication