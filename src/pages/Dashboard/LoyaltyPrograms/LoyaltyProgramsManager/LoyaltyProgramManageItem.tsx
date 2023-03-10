import {IonIcon, IonSpinner} from '@ionic/react'
import {chevronDownOutline, chevronForwardOutline} from 'ionicons/icons';
import React, {useEffect, useState} from 'react'
import PrimaryButton from '../../../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../../../components/inputs/PrimaryInput/PrimaryInput';
import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import useLoyaltyPrograms from '../../../../hooks/loyaltyProgram/useLoyaltyPrograms';
import useToast from '../../../../hooks/useToast';
import {DynamicInputIdentifier} from '../../../../models/dynamicInputIdentifier';
import {
    LoyaltyPartnershipDetails,
    LoyaltyProgram,
    UserLoyaltyProgram,
    UserLoyaltyProgramCurrency
} from '../../../../models/loyaltyProgram';
import {PartnershipType} from '../../../../types/exchangeType';
import styles from './loyaltyProgramManageItem.module.scss';

interface Props {
    item: LoyaltyProgram,
    myProgram: UserLoyaltyProgram | null
}

const LoyaltyProgramManageItem: React.FC<Props> = ({item, myProgram}) => {
    const [isSelected, setIsSelected] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [myUpdatedProgram, setMyUpdatedProgram] = useState<UserLoyaltyProgram | null>();
    const selectedPartnershipType: PartnershipType = item.activePartnerships?.exchangeIn ? 'in' :
        item.activePartnerships?.exchangeOut ? 'out' :
            item.activePartnerships?.redemption ? 'redemption' :
                item.activePartnerships?.issuing ? 'issuing' :
                    'out';
    const {
        connectProgram,
        disconnectProgram,
        filteredProgram,
        isUpdating
    } = useLoyaltyPrograms({
        programFilter: isSelected ? {
            programId: item.partnerId,
            exchangeType: selectedPartnershipType
        } : undefined
    });
    const {presentFailure} = useToast();

    const partnershipMetadata: LoyaltyPartnershipDetails | null = filteredProgram?.partnershipDetails as any;

    function initMyProgram() {
        const userLoyaltyProgram = new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(item.loyaltyCurrency.id,
                item.loyaltyCurrency.shortName,
                item.companyName,
                new Date(),
                '',
                item.partnerId,
                item.logo,
                item.activePartnerships?.exchangeIn ?? false,
                item.activePartnerships?.exchangeOut ?? false,
                item.activePartnerships?.currencyOwnerForRedemption ?? false,
                item.activePartnerships?.issuing ?? false),
            item.loyaltyCurrency.id,
            partnershipMetadata ?
                partnershipMetadata.executeAction.requiredFields.map(field => {
                    return new DynamicInputIdentifier(new Date(), 0, field.id, '')
                }) : [],
            new Date(),
            '',
            '',
            myProgram?.redemption ?? null,
            item.base64Logo
        );
        setMyUpdatedProgram(userLoyaltyProgram);
    }

    async function handleConnection() {
        if (isConnected) {
            const disconnected = await disconnectProgram(myUpdatedProgram?.userCurrencyId!);
            if (disconnected) {
                setIsConnected(false);
                initMyProgram();
            }
        } else {
            try {
                const result = await connectProgram(myUpdatedProgram!);
                setIsConnected(true);
                setMyUpdatedProgram(result);
            } catch (error: any) {
                presentFailure(error.message);
            }
        }
    }

    useEffect(() => {
        if (!myProgram && partnershipMetadata) initMyProgram()
    }, [partnershipMetadata])

    useEffect(() => {
        if (myProgram) {
            setMyUpdatedProgram(myProgram)
            setIsSelected(true)
            setIsConnected(true)
        } else {
            initMyProgram()
        }
    }, [myProgram])

    useEffect(() => {
        return () => {
            setMyUpdatedProgram(null)
        }
    }, [])

    const LoyaltyProgramPartnership = () => {
        return (
            <>
                {
                    myUpdatedProgram ?
                        <div className={styles.connectionContainer}>
                            <PrimaryTypography
                                customClassName={styles.connectionHeader}
                                color='light'>
                                {item.loyaltyCurrency.shortName}
                            </PrimaryTypography>

                            {
                                partnershipMetadata ?
                                    <>
                                        {
                                            partnershipMetadata.executeAction.requiredFields.map((field, index) => {
                                                return <div key={`field-${index}`} className={styles.connectionInput}>
                                                    <PrimaryInput
                                                        key={`field-${index}`}
                                                        placeholder={`Enter your ${field.name}`}
                                                        value={myUpdatedProgram.memberFields[index]?.value}
                                                        disabled={isConnected}
                                                        onChange={(value) => {
                                                            if (myUpdatedProgram.memberFields[index]) {
                                                                myUpdatedProgram.memberFields[index].value = value;
                                                                setMyUpdatedProgram(myUpdatedProgram);
                                                            }
                                                        }}/>
                                                </div>
                                            })
                                        }
                                        <PrimaryButton
                                            size='s'
                                            type={`${isConnected ? 'success' : 'dark'}`}
                                            onClick={handleConnection}
                                            loading={isUpdating}>
                                            {isConnected ? 'Disconnect' : 'Connect'}
                                        </PrimaryButton>
                                    </>
                                    :
                                    <IonSpinner color="light" className={styles.spinner}/>
                            }
                        </div>
                        :
                        <PrimaryTypography>No Partnership Programs</PrimaryTypography>
                }
            </>
        )
    }

    return (
        <div className={styles.container} style={{ background: item?.brand?.colors[0] }}>
            <div className={styles.togglerContainer}
                 onClick={() => setIsSelected(!isSelected)}>
                <div className={styles.id}>
                    <img alt='' src={item.logo} className={styles.logo}/>
                    <div className={styles.text}>
                        <PrimaryTypography isBold>{item.companyName}</PrimaryTypography>
                        <PrimaryTypography size='s'>1 program</PrimaryTypography>
                    </div>
                </div>

                <div className={styles.toggler}>
                    <PrimaryTypography>({item.loyaltyCurrency?.shortName})</PrimaryTypography>
                    <IonIcon icon={isSelected ? chevronDownOutline : chevronForwardOutline} size='small' color='light'/>
                </div>
            </div>
            {isSelected && <LoyaltyProgramPartnership/>}
        </div>
    )
}

export default LoyaltyProgramManageItem;