import { IonPage, useIonViewWillLeave } from '@ionic/react';
import { useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import PrimaryCheckbox from '../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import usePrimarySheet from '../../hooks/usePrimarySheet';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import Authentication from '../Authentication/Authentication';
import styles from './landing.module.scss';

const Landing: React.FC = () => {
    const [accepted, setAccepted] = useState(true);

    const { showModal: showAuthentication, dismissModal } = usePrimarySheet({
        component: Authentication,
        title: 'Email',
        id: 'authenticationModal',
        initialBreakpoint: 0.45
    });
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

    useIonViewWillLeave(() => {
        dismissModal()
    }, [])

    return (
        <IonPage>
            <PrimaryContainer>
                <div className={`${styles.containerContent} ion-text-center`}>
                        <GozoIcon />

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

                <BottomFixedContainer>
                    <TermsAcceptance />
                    <PrimaryButton
                        customStyles={styles.submitButton}
                        onClick={showAuthentication}
                        expand='block'
                        disabled={!accepted}>
                        get started
                    </PrimaryButton>
                </BottomFixedContainer>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Landing;
