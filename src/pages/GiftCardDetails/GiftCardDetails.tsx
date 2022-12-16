import { IonPage } from '@ionic/react'
import { useEffect } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import SecondaryInput from '../../components/inputs/SecondaryInput/SecondaryInput';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import SectionLoader from '../../components/loaders/section-loader/SectionLoader';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useGiftCard from '../../hooks/useGiftCard';
import useSearchParams from '../../hooks/useSearchParams';
import styles from './giftCardDetails.module.scss'


const GiftCardDetails: React.FC = () => {
    const search = useSearchParams();
    const id = search.get('gift_card_id')
    const { getGiftCard, giftCard, isLoading } = useGiftCard()


    useEffect(() => {
        if(id) getGiftCard(id)
    },[id])


    return (
        <IonPage>
            <SecondaryHeader title={giftCard?.name ?? 'Gift Card'} />
            <PrimaryContainer className={styles.container} >
                {
                    isLoading ?
                        <SectionLoader />
                        :
                        <div>
                            <div className={styles.buttonContainer}>
                                <PrimaryButton customStyles='' size='m'>Buy Now!</PrimaryButton>
                            </div>
                            <PrimaryTypography customClassName="">{giftCard?.name}</PrimaryTypography>
                            <img src={giftCard?.image} alt='' />
                            <div className={styles.inputContainer}>
                                <PrimaryTypography size='m' customClassName={styles.label}>Select the gift card amount</PrimaryTypography>
                                <SecondaryInput
                                    placeholder='$0.00'
                                    name="amount"
                                    onChange={() => { }}
                                    value={''}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <PrimaryTypography size='m' customClassName={styles.label}>Select the quantity of gift cards</PrimaryTypography>
                                <SecondaryInput
                                    placeholder='0'
                                    name="Quantity"
                                    onChange={() => { }}
                                    value={''}
                                />
                            </div>
                            <div className={styles.row}>
                                <PrimaryTypography customClassName={styles.column}>Name:</PrimaryTypography>
                                <PrimaryTypography customClassName={styles.column}>{giftCard?.name}</PrimaryTypography>
                            </div>
                            <div className={styles.row}>
                                <PrimaryTypography customClassName={styles.column}>Description:</PrimaryTypography>
                                <PrimaryTypography customClassName={styles.column}>{giftCard?.description}</PrimaryTypography>
                            </div>
                            <div className={styles.row}>
                                <PrimaryTypography customClassName={styles.column}>Availability:</PrimaryTypography>
                                <PrimaryTypography customClassName={styles.column}>{giftCard?.availabilty.length !== 0 ? giftCard?.availabilty.toString() : 'Open' }</PrimaryTypography>
                            </div>
                            <div className={styles.row}>
                                <PrimaryTypography customClassName={styles.column}>Flat Currency:</PrimaryTypography>
                                <PrimaryTypography customClassName={styles.column}>{giftCard?.currency}</PrimaryTypography>
                            </div>
                            <div className={styles.row}>
                                <PrimaryTypography customClassName={styles.column}>Terms & Conditions:</PrimaryTypography>
                                <PrimaryTypography customClassName={styles.column}>{giftCard?.termsAndConditions}</PrimaryTypography>
                            </div>
                            <div className={styles.row}>
                                <PrimaryTypography customClassName={styles.column}>Validity Term:</PrimaryTypography>
                                <PrimaryTypography customClassName={styles.column}>{giftCard?.validity}</PrimaryTypography>
                            </div>
                        </div>
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default GiftCardDetails