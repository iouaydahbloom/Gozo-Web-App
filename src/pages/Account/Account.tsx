import { IonIcon, IonPage } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import React from 'react'
import { useHistory } from 'react-router';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../constants/appRoutes';
import styles from './account.module.scss';
import AccountItem from './AccountItem/AccountItem';

const Account: React.FC = () => {
    const { push } = useHistory();
    return (
        <IonPage>
            <PrimaryContainer>
                <div className={styles.section}>
                    <PrimaryTypography size='l'>Profile</PrimaryTypography>
                    <br />
                    <AccountItem
                        icon={<IonIcon icon={personCircleOutline} />}
                        text='Profile Details'
                        onClick={() => push(AppRoutes.transactionHistory)}
                    />
                </div>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Account;