import React from 'react'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography'

interface Props {
    dismiss: () => void,
    text: string
}

const SpinSuccess: React.FC<Props> = ({ dismiss, text }) => {
    return (
        <div className='ion-text-center'>

            <PrimaryTypography
                size='s'
            >
                You just won $5.00 worth of MEA Miles
            </PrimaryTypography>

        </div>
    )
}

export default SpinSuccess