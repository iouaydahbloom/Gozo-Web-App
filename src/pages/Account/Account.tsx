import { IonPage, IonToggle } from '@ionic/react';
import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../constants/appRoutes';
import useAuthentication from '../../hooks/useAuthentication/useAuthentication';
import styles from './account.module.scss';
import AccountItem from './AccountItem/AccountItem';
import useAppDetails from '../../hooks/useAppDetails';
import ProfileIcon from '../../components/icons/ProfileIcon/ProfileIcon';
import TransactionHistoryIcon from '../../components/icons/TransactionHistoryIcon/TransactionHistoryIcon';
import ReferFriendsIcon from '../../components/icons/ReferFriendsIcon/ReferFriendsIcon';
import EnableSoundsIcon from '../../components/icons/EnableSoundsIcon/EnableSoundsIcon';
import PushNotificationsIcon from '../../components/icons/PushNotificationsIcon/PushNotificationsIcon';
import SecurityIcon from '../../components/icons/SecurityIcon/SecurityIcon';
import LightDarkIcon from '../../components/icons/LightDarkIcon/LightDarkIcon';
import HelpCenterIcon from '../../components/icons/HelpCenterIcon/HelpCenterIcon';
import LogoutIcon from '../../components/icons/LogoutIcon/LogoutIcon';
import useConfirmation from '../../hooks/useConfirmation';
import { WheelSettingsContext } from '../../providers/WheelSettingsProvider/wheelSettingsContext';

const Account: React.FC = () => {
    const { push } = useHistory();
    const { logout } = useAuthentication();
    const { appVersion } = useAppDetails();
    const { confirm } = useConfirmation();
    const { isMuted, toggle } = useContext(WheelSettingsContext);

    function handleLogout() {
        confirm({
            message: 'Are you sure you want to logout ?',
            title: 'Logout',
            onConfirmed: () => {
                return logout();
            }
        })
    }

    return (
        <IonPage>
            <TertiaryHeader title='Account' className='ion-text-center' />
            <PrimaryContainer>

                <div className={styles.section}>
                    <PrimaryTypography size='l'>Profile</PrimaryTypography>
                    <br />
                    <AccountItem
                        icon={<ProfileIcon />}
                        text='Profile Details'
                        onClick={() => push(AppRoutes.profile)}
                    />
                    <AccountItem
                        icon={<TransactionHistoryIcon />}
                        text='Transaction History'
                        onClick={() => push(AppRoutes.transactionHistory)}
                    />
                    <AccountItem
                        icon={<ReferFriendsIcon />}
                        text='Refer to a Friend'
                        onClick={() => { }}
                        isDisabled
                    />
                </div>
                <div className={styles.section}>
                    <PrimaryTypography size='l'>Settings</PrimaryTypography>
                    <br />
                    <AccountItem
                        icon={<EnableSoundsIcon />}
                        text='Disable Wheel Sound'
                        customEndSlot={<IonToggle checked={isMuted} onIonChange={(value) => toggle(value.detail.checked)}></IonToggle>}
                    />
                    <AccountItem
                        icon={<PushNotificationsIcon />}
                        text='Enable Push Notifications'
                        customEndSlot={<IonToggle disabled checked={false}></IonToggle>}
                        isDisabled
                    />
                    <AccountItem
                        icon={<SecurityIcon />}
                        text='Security'
                        onClick={() => { }}
                        isDisabled
                    />
                    <AccountItem
                        icon={<LightDarkIcon />}
                        text='Light/ Dark Mode'
                        customEndSlot={<IonToggle disabled checked={false}></IonToggle>}
                        isDisabled
                    />
                    <AccountItem
                        icon={<HelpCenterIcon />}
                        text='Help Center'
                        onClick={() => { }}
                        isDisabled
                    />
                    <AccountItem
                        icon={<LogoutIcon />}
                        text='Log Out'
                        onClick={handleLogout}
                    />
                </div>

                <PrimaryTypography>Application Version {appVersion}</PrimaryTypography>
                <br />
            </PrimaryContainer>
        </IonPage>
    )
}

export default Account;