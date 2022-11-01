import { IonIcon, IonPage, IonToggle } from '@ionic/react';
import { helpCircleOutline, invertModeOutline, lockClosedOutline, logOutOutline, notificationsOutline, peopleOutline, personOutline, readerOutline, volumeHighOutline } from 'ionicons/icons';
import React from 'react'
import { useHistory } from 'react-router';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../constants/appRoutes';
import useAuthentication from '../../hooks/useAuthentication';
import styles from './account.module.scss';
import AccountItem from './AccountItem/AccountItem';
import useAppDetails from '../../hooks/useAppDetails';

const Account: React.FC = () => {
    const { push } = useHistory();
    const { logout } = useAuthentication();
    const { appVersion } = useAppDetails();

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
                        onClick={() => { }}
                        isDisabled
                    />
                    <AccountItem
                        icon={<IonIcon icon={readerOutline} />}
                        text='Transaction History'
                        onClick={() => push(AppRoutes.transactionHistory)}
                    />
                    <AccountItem
                        icon={<IonIcon icon={peopleOutline} />}
                        text='Refer to a Friend'
                        onClick={() => { }}
                        isDisabled
                    />
                </div>
                <div className={styles.section}>
                    <PrimaryTypography size='l'>Settings</PrimaryTypography>
                    <br />
                    <AccountItem
                        icon={<IonIcon icon={volumeHighOutline} />}
                        text='Enable Sounds'
                        customEndSlot={<IonToggle disabled checked={false}></IonToggle>}
                        isDisabled
                    />
                    <AccountItem
                        icon={<IonIcon icon={notificationsOutline} />}
                        text='Enable Push Notifications'
                        customEndSlot={<IonToggle disabled checked={false}></IonToggle>}
                        isDisabled
                    />
                    <AccountItem
                        icon={<IonIcon icon={lockClosedOutline} />}
                        text='Security'
                        onClick={() => { }}
                        isDisabled
                    />
                    <AccountItem
                        icon={<IonIcon icon={invertModeOutline} />}
                        text='Light/ Dark Mode'
                        customEndSlot={<IonToggle disabled checked={false}></IonToggle>}
                        isDisabled
                    />
                    <AccountItem
                        icon={<IonIcon icon={helpCircleOutline} />}
                        text='Help Center'
                        onClick={() => { }}
                        isDisabled
                    />
                    <AccountItem
                        icon={<IonIcon icon={logOutOutline} />}
                        text='Log Out'
                        onClick={logout}
                    />
                </div>

                <PrimaryTypography>Application Version {appVersion}</PrimaryTypography>
                <br />
            </PrimaryContainer>
        </IonPage>
    )
}

export default Account;