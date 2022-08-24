import { IonButton, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useMoralis } from 'react-moralis';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import styles from './landing.module.scss';

const Landing: React.FC = () => {

    const { authenticate, isAuthenticated, user, authError, logout } = useMoralis();

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({
                provider: "web3Auth",
                clientId: "BLOjsWUuSYKzeWi8rlyl2EIPWijzTZ781Ffwr_MyNra0Q1zgxQsTzby03r44TxL9evzusGOMnLJEmwfk9M_OfN0",
            })
                .then(function (user) {
                    console.log(user?.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
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

                {
                    isAuthenticated ?
                        <>
                            <IonText>Great you are logged in as {user?.getUsername()}</IonText>
                            <br />
                            <IonButton onClick={logout}>Logout</IonButton>
                        </>
                        :
                        <PrimaryButton onClick={login}>get started</PrimaryButton>
                }

                {authError && <p>{authError.message}</p>}

                {/* <PrimaryButton onClick={login}>get started</PrimaryButton> */}
            </PrimaryContainer>
        </IonPage>
    )
}

export default Landing;
