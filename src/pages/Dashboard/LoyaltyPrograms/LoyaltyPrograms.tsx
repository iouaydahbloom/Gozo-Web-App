import { useContext, useEffect, useState } from 'react'
import { UserLoyaltyProgram } from '../../../models/loyaltyProgram';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { IonIcon } from '@ionic/react';
import LoyaltyProgramsManager from './LoyaltyProgramsManager/LoyaltyProgramsManager';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import PrimaryButtonsGroup from '../../../components/buttons/PrimaryButtonsGroup/PrimaryButtonsGroup';
import { addOutline, swapHorizontalOutline, trashOutline } from "ionicons/icons";
import styles from './loyaltyPrograms.module.scss';
import LoyaltyProgramItem from './LoyaltyProgramItem/LoyaltyProgramItem';
import collectionManipulationHelper from '../../../utils/collectionManipulationHelper';
import useLoyaltyPrograms from '../../../hooks/useLoyaltyPrograms';
import useToast from '../../../hooks/useToast';
import useConfirmation from '../../../hooks/useConfirmation';
import Swap from '../../Swap/Swap';
import { AssetMode } from '../../../constants/assetsMode';
import { currencySettingsContext } from '../../../providers/CurrencySettingsProvider/currencySettingsContext';
import usePrimarySheet from '../../../hooks/usePrimarySheet';
import SecondaryButtonsGroup from '../../../components/buttons/SecondaryButtonsGroup/SecondaryButtonsGroup';
import SectionLoader from '../../../components/loaders/section-loader/SectionLoader';

interface Props {
    programs: UserLoyaltyProgram[],
    getPrograms: () => Promise<UserLoyaltyProgram[]>,
    isLoading: boolean
}

const LoyaltyPrograms: React.FC<Props> = ({ programs, getPrograms, isLoading }) => {
    const { fetchGozoLoyaltyMembership } = useContext(currencySettingsContext);
    const [selectedUserCurrencyIds, setSelectedUserCurrencyIds] = useState<string[]>([]);
    const [isRemoving, setIsRemoving] = useState(false);

    const { showModal: showManager } = usePrimarySheet({
        title: 'Partners',
        component: LoyaltyProgramsManager,
        id: 'lpModal',
        onDismiss: getPrograms
    });
    const { showModal: showSwap } = usePrimarySheet({
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

    function switchButtons() {
        setIsRemoving(prev => !prev)
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
                            presentSuccess('Programs successfully disconnected');
                            switchButtons()
                            getPrograms();
                        }
                    })
            }
        })
    }

    const NoProgramsContainer = () => {
        return (
            <div className={styles.noDataContainer}>
                <PrimaryButton onClick={showManager} size='m' expand='block'>
                    <IonIcon icon={addOutline} />
                    add loyalty programs
                </PrimaryButton>
                <br />
                <PrimaryTypography customClassName={styles.center}>You have no loyalty programs added here yet</PrimaryTypography>
            </div>
        )
    }

    return (
        <div className={`${styles.container} ${programs.length == 0 ? styles.empty : ''}`}>
            {
                isLoading ?
                    <SectionLoader /> :
                    programs.length > 0 ?
                        <>
                            <div className={styles.actions}>
                                {isRemoving ?
                                    <SecondaryButtonsGroup
                                        buttons={[
                                            { title: "Cancel", onClick: switchButtons },
                                            { title: "Remove", fill: 'outline', onClick: disconnectSelected }
                                        ]}
                                    />
                                    :
                                    <PrimaryButtonsGroup
                                        buttons={[
                                            { title: 'Add', icon: <IonIcon icon={addOutline} />, onClick: showManager },
                                            { title: 'Remove', icon: <IonIcon icon={trashOutline} />, onClick: switchButtons },
                                            { title: 'Swap', icon: <IonIcon icon={swapHorizontalOutline} />, onClick: showSwap }
                                        ]}
                                    />
                                }
                            </div>
                            {programs.map((lp, index) => (
                                <LoyaltyProgramItem
                                    key={index}
                                    isSelectable={isRemoving}
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