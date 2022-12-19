import React from 'react'
import SectionPlaceholder from '../../../components/sections/SectionPlaceholder/SectionPlaceholder'

const GiftCardPurchaseSuccess: React.FC = () => {
    return (
        <SectionPlaceholder
            logoUrl='assets/icon/gift-card.svg'
            title='Thank you for your purchase!'
            description='we have sent instructions to your email address  on how to  use your card'
        />
    )
}

export default GiftCardPurchaseSuccess