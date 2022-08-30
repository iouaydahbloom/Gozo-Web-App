import { useEffect, useState } from 'react'
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

const LoyaltyPrograms = () => {
    const [selectedUserCurrencyIds, setSelectedUserCurrencyIds] = useState<string[]>([]);
    const { getUserLoyaltyPrograms } = useAssets();
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const [showManager] = useIonModal(LoyaltyProgramsManager);
    const { disconnectPrograms } = useLoyaltyPrograms();
    const { presentSuccess, presentInfo } = useToast();

    useEffect(() => {
        getPrograms();
    }, [])

    function getPrograms() {
        getUserLoyaltyPrograms()
            .then(programs => {
                setLoyaltyPrograms(programs);
            })
    }

    function showUpdate() {
        showManager({ initialBreakpoint: 0.90, breakpoints: [0, 0.25, 0.65, 0.90] })
    }

    function disconnectSelected() {
        if (selectedUserCurrencyIds.length == 0) {
            presentInfo('Select at least one Program');
            return
        }

        disconnectPrograms(selectedUserCurrencyIds)
            .then(disconnected => {
                if (disconnected) {
                    presentSuccess('Programs successfuly disconnected');
                    getPrograms();
                }
            })
    }

    const NoProgramsContainer = () => {
        return (
            <div className={styles.noDataContainer}>
                <PrimaryTypography customClassName={styles.center}>You have no loyalty programs added here yet</PrimaryTypography>
                <br /><br />
                <PrimaryButton onClick={showUpdate} size='m' expand='block'>
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
                                    { title: 'Add', icon: <IonIcon icon={addOutline} />, onClick: showUpdate },
                                    { title: 'Swap', icon: <IonIcon icon={swapHorizontalOutline} />, onClick: () => null },
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