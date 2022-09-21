import { IonPage, useIonViewWillLeave } from '@ionic/react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useModal from '../../hooks/useModal';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import Authentication from '../Authentication/Authentication';
import styles from './landing.module.scss';

const Landing: React.FC = () => {

    const { showModal: showAuthentication, dismissModal } = useModal({
        component: Authentication,
        title: 'Login/Register',
        id: 'authenticationModal'
    });
    useTabMenuHidder();

    useIonViewWillLeave(() => {
        dismissModal()
    }, [])

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
                    <PrimaryButton
                        onClick={showAuthentication}
                        expand='block'>
                        get started
                    </PrimaryButton>
                </BottomFixedContainer>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Landing;
