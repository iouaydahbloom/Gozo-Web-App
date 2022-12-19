import { IonCol, IonGrid, IonPage, IonRow, useIonViewWillEnter } from '@ionic/react'
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import SecondaryCard from '../../../components/cards/SecondaryCard/SecondaryCard';
import SecondaryHeader from '../../../components/headers/SecondaryHeader/SecondaryHeader';
import InputError from '../../../components/inputs/InputError/InputError';
import SecondaryInput from '../../../components/inputs/SecondaryInput/SecondaryInput';
import SecondarySelect, { SelectOption } from '../../../components/inputs/SecondarySelect/SecondarySelect';
import PrimaryContainer from '../../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../../components/loaders/PageLoader/PageLoader';
import ExtendedText from '../../../components/typography/ExtendedText/ExtendedText';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { FormValidator } from '../../../helpers/forms/form.helper';
import useGiftCard from '../../../hooks/useGiftCard';
import useSearchParams from '../../../hooks/useSearchParams';
import useToast from '../../../hooks/useToast';
import GiftCardPurchaseSuccess from '../GiftCardPurchaseSuccess/GiftCardPurchaseSuccess';
import styles from './giftCardDetails.module.scss';

const GiftCardDetails: React.FC = () => {
    const search = useSearchParams();
    const id = search.get('gift_card_id')
    const { getGiftCard, buyGiftCard, giftCard, isLoading, isBuying } = useGiftCard();
    const { presentFailure } = useToast();
    const [isBought, setIsBought] = useState(false);

    async function buy(amount: string) {
        if (!giftCard) return;
        await buyGiftCard(
            giftCard.id,
            giftCard.currency,
            amount,
            () => setIsBought(true),
            presentFailure
        );
    }

    const formManager = useFormik({
        initialValues: { amount: 0 },
        enableReinitialize: true,
        validate: (values) => {
            const errors: any = {};

            if (!FormValidator.hasValue(values.amount)) {
                errors.amount = "Amount is required";
            }

            return errors;
        },
        onSubmit: async (values) => {
            buy(values.amount!.toString());
        }
    });

    useEffect(() => {
        if (id) getGiftCard(id)
    }, [id])

    useIonViewWillEnter(() => {
        setIsBought(false);
    }, [])

    return (
        <IonPage>
            <SecondaryHeader title={giftCard?.name ?? 'Gift Card'} />
            <PrimaryContainer className={styles.container} >
                {
                    isBought ?
                        <GiftCardPurchaseSuccess />
                        :
                        isLoading ?
                            <PageLoader />
                            :
                            <div className={styles.details}>
                                <div className={styles.buttonContainer}>
                                    <PrimaryButton size='m' onClick={formManager.handleSubmit} loading={isBuying}>
                                        Buy Now!
                                    </PrimaryButton>
                                </div>
                                <PrimaryTypography customClassName="">{giftCard?.name}</PrimaryTypography>
                                <img src={giftCard?.image} alt='' />

                                <SecondaryCard className={styles.minmax}>
                                    <IonGrid>
                                        <IonRow>
                                            <IonCol>
                                                <PrimaryTypography>Minimum Value</PrimaryTypography>
                                            </IonCol>
                                            <IonCol>
                                                <PrimaryTypography customClassName={styles.minmaxValue}>
                                                    {giftCard?.minimumValue} {giftCard?.currency}
                                                </PrimaryTypography>
                                            </IonCol>
                                        </IonRow>

                                        <IonRow>
                                            <IonCol>
                                                <PrimaryTypography>Maximum Value</PrimaryTypography>
                                            </IonCol>
                                            <IonCol>
                                                <PrimaryTypography customClassName={styles.minmaxValue}>
                                                    {giftCard?.maximumValue} {giftCard?.currency}
                                                </PrimaryTypography>
                                            </IonCol>
                                        </IonRow>
                                    </IonGrid>
                                </SecondaryCard>

                                <div className={styles.inputContainer}>
                                    <PrimaryTypography size='m' customClassName={styles.label}>
                                        Select the gift card amount ({giftCard?.currency})
                                    </PrimaryTypography>
                                    {
                                        giftCard?.hasFixedAvailabilities ?
                                            <SecondarySelect
                                                placeholder='0.00'
                                                name="amount"
                                                onChange={formManager.handleChange}
                                                value={formManager.values.amount?.toString()}
                                                options={giftCard.availabilty.map(amount => (
                                                    new SelectOption(amount, amount)
                                                ))}
                                            />
                                            :
                                            <SecondaryInput
                                                placeholder='$0.00'
                                                name="amount"
                                                type='number'
                                                onChange={formManager.handleChange}
                                                value={formManager.values.amount}
                                                min={0}
                                            />
                                    }
                                    {
                                        formManager.errors.amount &&
                                        <InputError error={formManager.errors.amount} />
                                    }
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Name:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>{giftCard?.name}</PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Description:</PrimaryTypography>
                                    <ExtendedText customClassName={styles.column} text={giftCard?.description ?? ''} />
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Availability:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>
                                        {giftCard?.availabilty.length !== 0 ? giftCard?.availabilty.join(', ') : 'Open'}
                                    </PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Fiat Currency:</PrimaryTypography>
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