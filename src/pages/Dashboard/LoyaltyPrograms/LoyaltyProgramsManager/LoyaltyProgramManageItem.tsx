import { IonIcon, IonToolbar } from '@ionic/react'
import { chevronDownOutline, chevronForwardOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react'
import PrimaryButton from '../../../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../../../components/inputs/PrimaryInput/PrimaryInput';
import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import { LoyaltyProgram, MyLoyaltyProgram } from '../../../../models/loyaltyProgram'
import { ValueIdentifier } from '../../../../models/valueIdentifier';
import styles from './loyaltyProgramManageItem.module.scss';

interface Props {
    item: LoyaltyProgram,
    myProgram: MyLoyaltyProgram | null,
    onSelectionChange: (isSelected: boolean) => void,
    onMyProgramChange: (myProgram: MyLoyaltyProgram) => void
}

const LoyaltyProgramManageItem: React.FC<Props> = ({
    item,
    myProgram,
    onSelectionChange,
    onMyProgramChange
}) => {

    const [isSelected, setIsSelected] = useState(!!myProgram);
    const [myUpdatedProgram, setMyUpdatedProgram] = useState<MyLoyaltyProgram | null>(myProgram);

    function createMyProgram() {
        setMyUpdatedProgram(new MyLoyaltyProgram(
            item.companyName,
            item.partnerId,
            item.logo,
            item.loyaltyCurrency.id,
            item.loyaltyCurrency.shortName,
            item.partnershipDetails.executeAction.requiredFields.map(field => {
                return new ValueIdentifier(field.id, '')
            })
        ))
    }

    useEffect(() => {
        if (!myProgram) createMyProgram();
    }, [])

    useEffect(() => {
        onSelectionChange(isSelected);
    }, [isSelected])

    useEffect(() => {
        if (myUpdatedProgram) onMyProgramChange(myUpdatedProgram)
    }, [myUpdatedProgram])

    const LoyaltyProgramPartnership = () => {
        return (
            <>
                {
                    myUpdatedProgram ?
                        <div className={styles.connectionContainer}>
                            <IonToolbar className={styles.connectionActions}>
                                <div slot='start'>
                                    <PrimaryTypography color='dark'>{item.loyaltyCurrency.shortName}</PrimaryTypography>
                                </div>
                                <div slot='end'>
                                    <PrimaryButton size='s' type='dark'>Connect</PrimaryButton>
                                </div>
                            </IonToolbar>
                            {
                                myUpdatedProgram && item.partnershipDetails.executeAction.requiredFields.map((field, index) => {
                                    return <PrimaryInput
                                        key={`field-${index}`}
                                        placeholder={`Enter your ${field.name}`}
                                        value={myUpdatedProgram.membership[index]?.value}
                                        onChange={(value) => {
                                            if (myUpdatedProgram.membership[index]) myUpdatedProgram.membership[index].value = value;
                                            const newProgram = new MyLoyaltyProgram(
                                                myUpdatedProgram.companyName,
                                                myUpdatedProgram.programId,
                                                myUpdatedProgram.programLogo,
                                                myUpdatedProgram.caLoyaltyCurrency,
                                                myUpdatedProgram.caLoyaltyCurrencyName,
                                                myUpdatedProgram.membership
                                            )
                                            setMyUpdatedProgram(newProgram);
                                        }} />
                                })
                            }
                        </div> :
                        <PrimaryTypography>No Partnership Programs</PrimaryTypography>
                }
            </>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.togglerContainer}
                onClick={() => setIsSelected(!isSelected)}>
                <div className={styles.id}>
                    <img src={item.logo} className={styles.logo} />
                    <div className={styles.text}>
                        <PrimaryTypography isBold>{item.companyName}</PrimaryTypography>
                        <PrimaryTypography size='s'>1 program</PrimaryTypography>
                    </div>
                </div>

                <div className={styles.toggler}>
                    <PrimaryTypography>({item.loyaltyCurrency?.shortName})</PrimaryTypography>
                    <IonIcon icon={isSelected ? chevronDownOutline : chevronForwardOutline} size='small' color='light' />
                </div>
            </div>
            {isSelected && <LoyaltyProgramPartnership />}
        </div>
    )
}

export default LoyaltyProgramManageItem;