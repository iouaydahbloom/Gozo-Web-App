import { IonIcon, IonItemDivider, IonItemGroup, IonLabel, IonPage, IonToggle } from '@ionic/react';
import { helpCircleOutline, invertModeOutline, lockClosedOutline, logOutOutline, notificationsOutline, peopleOutline, personCircleOutline, personOutline, readerOutline, volumeHighOutline } from 'ionicons/icons';
import React from 'react'
import { useHistory } from 'react-router';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../constants/appRoutes';
import useAuthentication from '../../hooks/useAuthentication';
import { useDapp } from '../../providers/DappProvider/DappProvider';
import styles from './account.module.scss';
import AccountItem from './AccountItem/AccountItem';

const Account: React.FC = () => {
    const { push } = useHistory();
    const { walletAddress } = useDapp();
    const { logout } = useAuthentication();

    return (
        <IonPage>
            <TertiaryHeader title='Account' className='ion-text-center' />
            <PrimaryContainer>
                
                <div className={styles.section}>
                    <PrimaryTypography size='l'>Profile</PrimaryTypography>
                    <br />
                    <AccountItem
                        icon={<IonIcon className={styles.customIcon} icon={personOutline} />}
                        text='Profile Details'
                        onClick={() => {}}
                    />
                    <AccountItem
                        icon={<IonIcon icon={readerOutline} />}
                        text='Transaction History'
                        onClick={() => push(AppRoutes.transactionHistory)}
                    />
                    <AccountItem
                        icon={<IonIcon icon={peopleOutline} />}
                        text='Refer to a Friend'
                        onClick={() => {}}
                    />
                </div>
                <div className={styles.section}>
                    <PrimaryTypography size='l'>Settings</PrimaryTypography>
                    <br />
                    <AccountItem
                        icon={<IonIcon icon={volumeHighOutline} />}
                        text='Enable Sounds'
                        customEndIcon={<IonToggle checked={true}></IonToggle>}
                    />
                    <AccountItem
                        icon={<IonIcon icon={notificationsOutline} />}
                        text='Enable Push Notifications'
                        customEndIcon={<IonToggle checked={false}></IonToggle>}
                    />
                    <AccountItem
                        icon={<IonIcon icon={lockClosedOutline} />}
                        text='Security'
                        onClick={() => {}}
                    />
                    <AccountItem
                        icon={<IonIcon icon={invertModeOutline} />}
                        text='Light/ Dark Mode'
                        customEndIcon={<IonToggle checked={true}></IonToggle>}
                    />
                    <AccountItem
                        icon={<IonIcon icon={helpCircleOutline} />}
                        text='Help Center'
                        onClick={() => {}}
                    />
                    <AccountItem
                        icon={<IonIcon icon={logOutOutline} />}
                        text='Log Out'
                        onClick={logout}
                    />
                </div>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Account;