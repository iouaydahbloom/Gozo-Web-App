import React, {useEffect, useState} from "react"
import PrimaryButton from "../../../components/buttons/PrimaryButton/PrimaryButton"
import PrimaryInput from "../../../components/inputs/PrimaryInput/PrimaryInput"
import SectionLoader from "../../../components/loaders/section-loader/SectionLoader"
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import usePrize from "../../../hooks/prize/usePrize"
import useReward from "../../../hooks/reward/useReward"
import useToast from "../../../hooks/useToast"
import {KeyValue} from "../../../models/keyValue"
import styles from './claimReward.module.scss'

interface Props {
    prizeId: string,
    rewardId: string,
    dismiss: () => void
}

const ClaimReward: React.FC<Props> = ({prizeId, rewardId, dismiss}) => {
    const {prize, isLoadingPrize} = usePrize({prizeId})
    const [fields, setFields] = useState<KeyValue[]>([])
    const {claimReward, isLoadingSubmission} = useReward()
    const {presentFailure, presentSuccess} = useToast();

    const handleSubmission = () => {
        claimReward({rewardId, fields})
            .then(res => {
                if (res.isSuccess) {
                    presentSuccess("Successfully updated")
                } else {
                    presentFailure(res.message)
                }
                dismiss();
            })
    }

    const handleOnChange = (value: string, index: number) => {
        let fieldsRef = [...fields]
        fieldsRef[index].value = value
        setFields(fieldsRef)
    }

    useEffect(() => {
        if (prize) setFields(prize?.requiredData ?
            prize.requiredData?.map((field) => new KeyValue(field.key, ''))
            :
            []
        )
    }, [prize])

    return (
        <div>
            {!isLoadingPrize ?
                <>
                    {
                        prize?.requiredData && prize.requiredData.length !== 0 ?
                            <div>

                                {
                                    prize?.requiredData.map((field, index) => {
                                        return <div key={`field-${index}`}>
                                            <PrimaryTypography
                                                customClassName={styles.fieldLabel}>
                                                {field.name}
                                            </PrimaryTypography>
                                            <PrimaryInput
                                                key={`field-${index}`}
                                                placeholder={`Enter your ${field.name}`}
                                                value={fields[index]?.value}
                                                type={field.type}
                                                className={styles.requiredField}
                                                onChange={(value) => handleOnChange(value, index)}/>
                                        </div>
                                    })
                                }
                                <div className='ion-text-center ion-padding-vertical'>
                                    <PrimaryButton
                                        onClick={handleSubmission}
                                        expand='block'
                                        loading={isLoadingSubmission}>
                                        Claim
                                    </PrimaryButton>
                                </div>

                            </div>
                            :
                            <PrimaryTypography>No Data Required</PrimaryTypography>
                    }
                </>
                :
                <SectionLoader/>
            }

        </div>
    )
}

export default ClaimReward