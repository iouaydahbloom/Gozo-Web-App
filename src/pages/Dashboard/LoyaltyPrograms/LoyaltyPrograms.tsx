import { useEffect, useState } from 'react'
import { UserLoyaltyProgram } from '../../../models/loyaltyProgram';
import useMemberShip from '../../../hooks/useMembership';
import useAssets from '../../../hooks/useAssets';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { useIonModal } from '@ionic/react';
import LoyaltyProgramsManager from './LoyaltyProgramsManager/LoyaltyProgramsManager';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';

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
        <div>
            {
                loyaltyPrograms.length > 0 ?
                    <>
                        <PrimaryButton onClick={showManager}>+ add</PrimaryButton>
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
                    <PrimaryButton onClick={showManager}>+ add loyalty programs</PrimaryButton>
            }
        </div>
    )
}

export default LoyaltyPrograms;