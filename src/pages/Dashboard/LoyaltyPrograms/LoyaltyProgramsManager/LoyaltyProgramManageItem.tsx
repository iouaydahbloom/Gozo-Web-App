import { IonInput } from '@ionic/react'
import { useEffect, useState } from 'react'
import { LoyaltyProgram, MyLoyaltyProgram } from '../../../../models/loyaltyProgram'
import { ValueIdentifier } from '../../../../models/valueIdentifier'

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

    return (
        <div>
            <div onClick={() => setIsSelected(!isSelected)}>
                <div>{item.companyName} - {item.loyaltyCurrency?.shortName}</div>
            </div>
            {
                isSelected && myUpdatedProgram &&
                <div>
                    {
                        item.partnershipDetails.executeAction.requiredFields.map((field, index) => {
                            return <IonInput
                                key={`field-${index}`}
                                placeholder={field.name}
                                value={myUpdatedProgram.membership[index]?.value}
                                onChange={(event) => {
                                    if (myUpdatedProgram.membership[index]) myUpdatedProgram.membership[index].value = event.currentTarget.value?.toString() ?? '';
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
                </div>
            }
        </div>
    )
}

export default LoyaltyProgramManageItem;