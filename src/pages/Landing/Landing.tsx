import {IonPage, useIonViewWillLeave} from '@ionic/react';
import {useEffect, useState} from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import PrimaryCheckbox from '../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryFooter from '../../components/layout/PrimaryFooter/PrimaryFooter';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import usePrimarySheet from '../../hooks/usePrimarySheet';
import useTabMenuHider from '../../hooks/useTabMenuHider';
import Authentication from '../Authentication/Authentication';
import styles from './landing.module.scss';

const Landing: React.FC = () => {
    const [accepted, setAccepted] = useState(true);
    const {showModal: showAuthentication, dismissModal} = usePrimarySheet({
        component: Authentication,
        title: 'Email',
        id: 'authenticationModal',
        initialBreakpoint: .6
    });
    useTabMenuHider();

    const TermsAcceptance = () => {
        return (
            <div className={styles.termsContainer}>
                <div className={styles.checkboxField}>
                    <PrimaryCheckbox value={accepted} onChange={setAccepted}/>
                </div>
                <PrimaryTypography customClassName={styles.textField}>
                    I’ve read and accepted the
                    <a href='http://gozo.io/terms-conditions.php' target='_blank'>Terms of Service</a>
                    and
                    <a href=' http://gozo.io/privacy-policy.php' target='_blank'>Privacy Policy</a>
                </PrimaryTypography>
            </div>
        )
    }

    useIonViewWillLeave(() => {
        dismissModal();
    }, [])

    useEffect(() => {
        return () => {
            dismissModal();
        }
    }, []);

    return (
        <IonPage>
            <PrimaryContainer>
                <div className={`${styles.containerContent}`}>
                    <div className={`${styles.content}`}>
                        <GozoIcon/>

                        <PrimaryTypography
                            isBold
                            size='xxxl'
                            customClassName='ion-padding-horizontal'>
                            GOZO
                        </PrimaryTypography>

                        <PrimaryTypography
                            size='l'
                            customClassName='ion-padding'>
                            Make use of your unredeemed loyalty points
                        </PrimaryTypography>
                    </div>
                </div>
            </PrimaryContainer>
            <PrimaryFooter className={styles.footer}>
                <TermsAcceptance/>
                <PrimaryButton
                    customStyles={styles.submitButton}
                    onClick={showAuthentication}
                    expand='block'
                    disabled={!accepted}>
                    get started
                </PrimaryButton>
            </PrimaryFooter>
        </IonPage>
    )
}

export default Landing;
