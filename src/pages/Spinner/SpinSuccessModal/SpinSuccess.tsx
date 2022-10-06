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
                {text}
            </PrimaryTypography>

        </div>
    )
}

export default SpinSuccess