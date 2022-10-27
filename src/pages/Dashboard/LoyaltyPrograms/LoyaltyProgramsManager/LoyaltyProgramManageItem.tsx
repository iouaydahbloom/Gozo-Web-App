import { IonIcon } from '@ionic/react'
import { chevronDownOutline, chevronForwardOutline } from 'ionicons/icons';
import { useCallback, useEffect, useState } from 'react'
import PrimaryButton from '../../../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../../../components/inputs/PrimaryInput/PrimaryInput';
import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import useLoyaltyPrograms from '../../../../hooks/useLoyaltyPrograms';
import useToast from '../../../../hooks/useToast';
import { DynamicInputIdentifier } from '../../../../models/dynamicInputIdentifier';
import { LoyaltyPartnershipDetails, LoyaltyProgram, UserLoyaltyProgram, UserLoyaltyProgramCurrency } from '../../../../models/loyaltyProgram';
import { PartnershipType } from '../../../../types/exchangeType';
import styles from './loyaltyProgramManageItem.module.scss';

interface Props {
    item: LoyaltyProgram,
    myProgram: UserLoyaltyProgram | null
}

const LoyaltyProgramManageItem: React.FC<Props> = ({ item, myProgram }) => {
    const [isSelected, setIsSelected] = useState(!!myProgram);
    const [isConnected, setIsConnected] = useState(!!myProgram);
    const [partnershipMetadata, setPartnershipMetadata] = useState<LoyaltyPartnershipDetails | null>();
    const [myUpdatedProgram, setMyUpdatedProgram] = useState<UserLoyaltyProgram | null>(myProgram);
    const { connectProgram, disconnectProgram, fetchFilteredProgram, isUpdating } = useLoyaltyPrograms();
    const { presentFailure } = useToast();

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
            myProgram?.redemption ?? null
        );
        setMyUpdatedProgram(userLoyaltyProgram);
    }

    function handleConnection() {
        if (isConnected) {
            disconnectProgram(myUpdatedProgram?.userCurrencyId!)
                .then(disconnected => {
                    if (disconnected) {
                        setIsConnected(false);
                        initMyProgram();
                    }
                })
        } else {
            connectProgram(myUpdatedProgram!)
                .then(result => {
                    if (result.isSuccess) {
                        setIsConnected(true);
                        setMyUpdatedProgram(result.data);
                    } else if (result.errors) {
                        presentFailure(result.errors.detail);
                    }
                })
        }
    }

    const getPartnershipMetadata = useCallback(async () => {
        const partnershipType: PartnershipType =
            item.activePartnerships?.exchangeIn ? 'in' :
                item.activePartnerships?.exchangeOut ? 'out' :
                    item.activePartnerships?.redemption ? 'redemption' :
                        item.activePartnerships?.issuing ? 'issuing' :
                            'out';

        return fetchFilteredProgram(item.partnerId, partnershipType)
            .then(program => {
                setPartnershipMetadata(program?.partnershipDetails);
            })
    }, [item.partnerId])

    useEffect(() => {
        if (isSelected && !partnershipMetadata) {
            getPartnershipMetadata()
        }
    }, [isSelected])

    useEffect(() => {
        if (!myProgram) {
            initMyProgram()
        }
    }, [partnershipMetadata])

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
                                myUpdatedProgram && partnershipMetadata?.executeAction.requiredFields.map((field, index) => {
                                    return <div key={`field-${index}`} className={styles.connectionInput}>
                                        <PrimaryInput
                                            key={`field-${index}`}
                                            placeholder={`Enter your ${field.name}`}
                                            value={myUpdatedProgram.memberFields[index]?.value}
                                            onChange={(value) => {
                                                if (myUpdatedProgram.memberFields[index]) {
                                                    myUpdatedProgram.memberFields[index].value = value;
                                                    setMyUpdatedProgram(myUpdatedProgram);
                                                }
                                            }} />
                                    </div>
                                })
                            }

                            <PrimaryButton
                                size='s'
                                type={`${isConnected ? 'success' : 'dark'}`}
                                onClick={handleConnection}
                                disabled={isUpdating}>
                                {isConnected ? 'Disconnect' : 'Connect'}
                            </PrimaryButton>
                        </div>
                        :
                        <PrimaryTypography>No Partnership Programs</PrimaryTypography>
                }
            </>
        )
    }

    return (
        <div className={styles.container} style={{background: item?.brand?.color1}}>
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