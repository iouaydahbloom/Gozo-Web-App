import { IonPage } from '@ionic/react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useAuthentication from '../../hooks/useAuthentication';
import styles from './landing.module.scss';

const Landing: React.FC = () => {

    const { login, isAuthenticated, authError, logout } = useAuthentication();

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
                {!isAuthenticated ? <PrimaryButton onClick={login}>get started</PrimaryButton> : <PrimaryButton onClick={logout}>logout</PrimaryButton>}

                {authError && <PrimaryTypography>{authError.message}</PrimaryTypography>}
            </PrimaryContainer>
        </IonPage>
    )
}

export default Landing;
