import React from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton'
import PrimaryContainer from '../../../components/layout/PrimaryContainer/PrimaryContainer'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography'

interface Props {
    setSpinWheel: React.Dispatch<React.SetStateAction<boolean>>,
    dismiss: () => void
}

const SpinCondition : React.FC<Props> = ({setSpinWheel, dismiss}) => {
  return (
    <div className='ion-text-center ion-padding'>

    <PrimaryTypography
        size='s'
        >
        In order to proceed with the Spin, a fee of 3.00 points will be extracted from your account
    </PrimaryTypography>

    <PrimaryButton onClick={() => { dismiss(); setSpinWheel(true) }} size='m' expand='block'>
        confirm
    </PrimaryButton>
    <PrimaryButton fill='clear' type='link' onClick={()=> dismiss()} size='m' expand='block'>
        cancel
    </PrimaryButton>
        </div>
  )
}

export default SpinCondition