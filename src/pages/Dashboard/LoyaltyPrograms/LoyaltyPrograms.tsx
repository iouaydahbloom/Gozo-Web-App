import { useContext, useEffect, useState } from 'react'
import { UserLoyaltyProgram } from '../../../models/loyaltyProgram';
import useAssets from '../../../hooks/useAssets';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { IonIcon, useIonModal } from '@ionic/react';
import LoyaltyProgramsManager from './LoyaltyProgramsManager/LoyaltyProgramsManager';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import PrimaryButtonsGroup from '../../../components/buttons/PrimaryButtonsGroup/PrimaryButtonsGroup';
import { addOutline, swapHorizontalOutline, trashOutline } from "ionicons/icons";
import styles from './loyaltyPrograms.module.scss';
import LoyaltyProgramItem from './LoyaltyProgramItem/LoyaltyProgramItem';
import collectionManipulationHelper from '../../../utils/collectionManipulationHelper';
import useLoyaltyPrograms from '../../../hooks/useLoyaltyPrograms';
import useToast from '../../../hooks/useToast';
import useModal from '../../../hooks/useModal';
import useConfirmation from '../../../hooks/useConfirmation';
import Swap from '../../Swap/Swap';
import { AssetMode } from '../../../constants/assetsMode';
import { currencySettingsContext } from '../../../providers/CurrencySettingsProvider/currencySettingsContext';

const LoyaltyPrograms = () => {
    const { fetchGozoLoyaltyMembership } = useContext(currencySettingsContext);
    const [selectedUserCurrencyIds, setSelectedUserCurrencyIds] = useState<string[]>([]);
    const { getUserLoyaltyPrograms } = useAssets();
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const { showModal: showManager } = useModal({
        title: 'Partners',
        component: LoyaltyProgramsManager,
        id: 'lpModal',
        onDismiss: getPrograms
    });
    const { showModal: showSwap } = useModal({
        title: 'Swap',
        component: Swap,
        componentProps: { mode: AssetMode.loyaltyPoint },
        id: 'swapModal',
        onDismiss: () => {
            fetchGozoLoyaltyMembership();
            getPrograms();
        }
    });
    const { disconnectPrograms } = useLoyaltyPrograms();
    const { presentSuccess, presentInfo } = useToast();
    const { confirm } = useConfirmation();

    useEffect(() => {
        getPrograms();
    }, [])

    function getPrograms() {
        getUserLoyaltyPrograms()
            .then(programs => {
                setLoyaltyPrograms(programs);
            })
    }

    function disconnectSelected() {
        if (selectedUserCurrencyIds.length == 0) {
            presentInfo('Select at least one Program');
            return
        }

        confirm({
            message: 'Are you sure you want to disconnect',
            title: 'Disconnect',
            onConfirmed: () => {
                disconnectPrograms(selectedUserCurrencyIds)
                    .then(disconnected => {
                        if (disconnected) {
                            presentSuccess('Programs successfuly disconnected');
                            getPrograms();
                        }
                    })
            }
        })
    }

    const NoProgramsContainer = () => {
        return (
            <div className={styles.noDataContainer}>
                <PrimaryTypography customClassName={styles.center}>You have no loyalty programs added here yet</PrimaryTypography>
                <br /><br />
                <PrimaryButton onClick={showManager} size='m' expand='block'>
                    <IonIcon icon={addOutline} />
                    add loyalty programs
                </PrimaryButton>
            </div>
        )
    }

    return (
        <div className={`${styles.container} ${loyaltyPrograms.length == 0 ? styles.empty : ''}`}>
            {
                loyaltyPrograms.length > 0 ?
                    <>
                        <div className={styles.actions}>
                            <PrimaryButtonsGroup
                                buttons={[
                                    { title: 'Add', icon: <IonIcon icon={addOutline} />, onClick: showManager },
                                    { title: 'Swap', icon: <IonIcon icon={swapHorizontalOutline} />, onClick: showSwap },
                                    { title: 'Remove', icon: <IonIcon icon={trashOutline} />, onClick: disconnectSelected }
                                ]}
                            />
                        </div>
                        {loyaltyPrograms.map((lp, index) => (
                            <LoyaltyProgramItem
                                key={index}
                                loyaltyProgram={lp}
                                onSelection={(selected, program) => {
                                    if (selected) {
                                        setSelectedUserCurrencyIds([...selectedUserCurrencyIds, program.userCurrencyId]);
                                    } else {
                                        const index = selectedUserCurrencyIds.findIndex(sp => sp == program.userCurrencyId);
                                        const updated = collectionManipulationHelper.removeAtIndex(selectedUserCurrencyIds, index);
                                        setSelectedUserCurrencyIds(updated);
                                    }
                                }} />
                        ))}
                    </> :
                    <NoProgramsContainer />
            }
        </div>
    )
}

export default LoyaltyPrograms;