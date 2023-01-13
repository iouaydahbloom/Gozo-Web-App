import {IonCol, IonGrid, IonPage, IonRow, useIonViewWillEnter} from '@ionic/react'
import {useFormik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import SecondaryCard from '../../../components/cards/SecondaryCard/SecondaryCard';
import SecondaryHeader from '../../../components/headers/SecondaryHeader/SecondaryHeader';
import InputError from '../../../components/inputs/InputError/InputError';
import SecondaryInput from '../../../components/inputs/SecondaryInput/SecondaryInput';
import SecondarySelect, {SelectOption} from '../../../components/inputs/SecondarySelect/SecondarySelect';
import PrimaryContainer from '../../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../../components/loaders/PageLoader/PageLoader';
import ExtendedText from '../../../components/typography/ExtendedText/ExtendedText';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import SanitizeHtml from '../../../components/typography/SanitizeHtml/SanitizeHtml';
import {FormValidator} from '../../../helpers/forms/form.helper';
import useGiftCard from '../../../hooks/giftCard/useGiftCard';
import useTabMenuHidder from '../../../hooks/useTabMenuHidder';
import useToast from '../../../hooks/useToast';
import GiftCardPurchaseSuccess from '../GiftCardPurchaseSuccess/GiftCardPurchaseSuccess';
import styles from './giftCardDetails.module.scss';

const GiftCardDetails: React.FC = () => {

    const {id} = useParams<{ id: string }>();
    const {
        getGiftCard,
        buyGiftCard,
        simulateFiatToPointsConversion,
        giftCard,
        isLoading,
        isBuying
    } = useGiftCard({giftCardId: id});
    const {presentFailure} = useToast();
    const [isBought, setIsBought] = useState(false);
    const [conversionRate, setConversionRate] = useState<number>(0);
    useTabMenuHidder();

    async function buy(amount: string) {
        if (!giftCard) return;
        await buyGiftCard(
            giftCard.id,
            giftCard.currency,
            amount,
            () => setIsBought(true),
            presentFailure,
            conversionRate
        );
    }

    async function getGiftCardDetails() {
        //if (id) getGiftCard(id)
        getGiftCard();
    }

    const formManager = useFormik({
        initialValues: {amount: giftCard?.minimumValue ?? 0},
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
        getGiftCardDetails();
    }, [id])

    useEffect(() => {
        if (!giftCard) {
            return
        }
        simulateFiatToPointsConversion(giftCard.currency, '1')
            .then(result => {
                if (result.isSuccess) setConversionRate(result.data.loyaltyAmount)
            })
    }, [giftCard?.currency])

    useIonViewWillEnter(() => {
        setIsBought(false);
    }, [])

    return (
        <IonPage>
            <SecondaryHeader title={giftCard?.name ?? 'Gift Card'}/>
            <PrimaryContainer className={styles.container} isRefreshable onRefresh={getGiftCardDetails}>
                {
                    isBought ?
                        <GiftCardPurchaseSuccess/>
                        :
                        isLoading ?
                            <PageLoader/>
                            :
                            <div className={styles.details}>
                                <PrimaryTypography customClassName="">{giftCard?.name}</PrimaryTypography>
                                <img src={giftCard?.image} alt='gift-card-cover' className={styles.cover}/>

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
                                                required
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
                                                placeholder='0'
                                                name="amount"
                                                type='number'
                                                onChange={(event: any) =>
                                                    formManager.setFieldValue('amount', event.detail.value)}
                                                value={formManager.values.amount}
                                                min={0}
                                            />
                                    }
                                    {
                                        formManager.errors.amount &&
                                        <InputError error={formManager.errors.amount}/>
                                    }
                                    <PrimaryTypography customClassName={styles.rate}>{giftCard?.currency}1.00
                                        = {conversionRate} Super Points</PrimaryTypography>
                                </div>

                                <div className={styles.buttonContainer}>
                                    <PrimaryButton
                                        size='m'
                                        onClick={formManager.handleSubmit}
                                        loading={isBuying}
                                        expand='block'>
                                        Buy Now!
                                    </PrimaryButton>
                                </div>

                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Name:</PrimaryTypography>
                                    <PrimaryTypography
                                        customClassName={styles.column}>{giftCard?.name}</PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Description:</PrimaryTypography>
                                    <ExtendedText customClassName={styles.column} text={giftCard?.description ?? ''}/>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Availability:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>
                                        {giftCard?.availabilty.length !== 0 ? giftCard?.availabilty.join(', ') : 'Open'}
                                    </PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Fiat
                                        Currency:</PrimaryTypography>
                                    <PrimaryTypography
                                        customClassName={styles.column}>{giftCard?.currency}</PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Validity
                                        Term:</PrimaryTypography>
                                    <PrimaryTypography
                                        customClassName={styles.column}>{giftCard?.validity}</PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Terms &
                                        Conditions:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>
                                        {
                                            giftCard?.termsAndConditionsUrl ?
                                                <a href={giftCard?.termsAndConditionsUrl} target="_blank">Open terms &
                                                    conditions</a>
                                                :
                                                <SanitizeHtml html={giftCard?.termsAndConditionsHtml}/>
                                        }
                                    </PrimaryTypography>
                                </div>
                            </div>
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default GiftCardDetails