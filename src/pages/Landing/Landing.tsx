import { IonPage } from '@ionic/react';
import { useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import PrimaryCheckbox from '../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import PrimaryInput from '../../components/inputs/PrimaryInput/PrimaryInput';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useAuthentication from '../../hooks/useAuthentication';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import styles from './landing.module.scss';

const Landing: React.FC = () => {

    const { login, isAuthenticated, isAuthenticating, authError, logout } = useAuthentication();
    const [accepted, setAccepted] = useState(true);
    const [email, setEmail] = useState('');
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
        <IonPage>
            <PrimaryContainer>
                <div className='ion-text-center'>
                    <GozoIcon />
                </div>

                <PrimaryTypography
                    isBold
                    size='xxl'
                    customClassName={styles.text}>
                    GOZO
                </PrimaryTypography>

                <PrimaryTypography
                    size='l'
                    customClassName={styles.text}>
                    Make use of your unredeemed loyalty points
                </PrimaryTypography>

                <BottomFixedContainer>
                    {
                        !isAuthenticated ?
                            <>

                                <PrimaryInput
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={setEmail} />
                                {authError && <PrimaryTypography
                                    color='danger'
                                    customClassName={styles.error}>
                                    {authError.message}
                                </PrimaryTypography>}
                                <br />
                                <TermsAcceptance />
                                <PrimaryButton
                                    onClick={() => login(email)}
                                    expand='block'
                                    disabled={isAuthenticating || !accepted}>
                                    get started
                                </PrimaryButton>
                            </>
                            :
                            <PrimaryButton onClick={logout} expand='block'>logout</PrimaryButton>
                    }
                </BottomFixedContainer>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Landing;
