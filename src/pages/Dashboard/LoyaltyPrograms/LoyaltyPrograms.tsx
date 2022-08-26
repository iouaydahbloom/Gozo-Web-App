import { useEffect, useState } from 'react'
import { UserLoyaltyProgram } from '../../../models/loyaltyProgram';
import useMemberShip from '../../../hooks/useMembership';
import useAssets from '../../../hooks/useAssets';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { IonIcon, useIonModal } from '@ionic/react';
import LoyaltyProgramsManager from './LoyaltyProgramsManager/LoyaltyProgramsManager';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import PrimaryButtonsGroup from '../../../components/buttons/PrimaryButtonsGroup/PrimaryButtonsGroup';
import { addOutline } from "ionicons/icons";
import styles from './loyaltyPrograms.module.scss';

const LoyaltyPrograms = () => {
    const [selectedProgram, setSelectedProgram] = useState<UserLoyaltyProgram>();
    const { getUserLoyaltyPrograms } = useAssets();
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const { membership } = useMemberShip(selectedProgram?.currency.loyaltyCurrency);
    const [showManager] = useIonModal(LoyaltyProgramsManager);

    useEffect(() => {
        if (membership) alert(`${membership.loyaltyCurrency} Balance: ${membership.balance}`);
    }, [membership]);

    useEffect(() => {
        getUserLoyaltyPrograms()
            .then(programs => {
                setLoyaltyPrograms(programs);
            })
    }, [])

    return (
        <div className={styles.container}>
            {
                loyaltyPrograms.length > 0 ?
                    <>
                        <PrimaryButtonsGroup
                            buttons={[
                                { title: 'Add', icon: <IonIcon icon={addOutline} />, onClick: showManager },
                                { title: 'Swap', icon: <IonIcon icon={''} />, onClick: showManager },
                                { title: 'Remove', icon: <IonIcon icon={''} />, onClick: showManager }
                            ]}
                        />
                        {
                            loyaltyPrograms.map((lp, index) => {
                                return (
                                    <div key={index} onClick={() => setSelectedProgram(lp)}>
                                        <PrimaryTypography size='l'>{lp.currency.companyName} - {lp.currency.programId}</PrimaryTypography>
                                        <br />
                                    </div>
                                )
                            })
                        }
                    </> :
                    <div className={styles.noDataContainer}>
                        <PrimaryTypography customClassName={styles.center}>You have no loyalty programs added here yet</PrimaryTypography>
                        <br /><br />
                        <PrimaryButton onClick={showManager} size='m' expand='block'>+ add loyalty programs</PrimaryButton>
                    </div>
            }
        </div>
    )
}

export default LoyaltyPrograms;