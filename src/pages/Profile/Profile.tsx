import {IonPage} from '@ionic/react'
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import {FormField} from '../../components/forms/FormField/FormField';
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import {FormHelper, FormValidator} from '../../helpers/forms/form.helper';
import useProfile from '../../hooks/profile/useProfile';
import {ProfileDetails} from '../../models/profileDetails';
import {useFormik} from "formik";
import InputError from '../../components/inputs/InputError/InputError';
import styles from './profile.module.scss'
import useToast from '../../hooks/useToast';
import SecondaryInput from '../../components/inputs/SecondaryInput/SecondaryInput';
import {Keyboard} from '@capacitor/keyboard';
import PrimaryAccordion from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';
import React from "react";
import useTabMenuHidder from "../../hooks/useTabMenuHider";

const Profile: React.FC = () => {

    const {profileDetails, socialAccountTypes, updateProfileDetails, isSubmitting} = useProfile();
    const {presentSuccess, presentFailure} = useToast();
    useTabMenuHidder();

    const formManager = useFormik({
        initialValues: new ProfileDetails(
            profileDetails?.name ?? '',
            profileDetails?.address ?? '',
            profileDetails?.email,
            profileDetails?.walletAddress,
            profileDetails?.socialAccounts),
        enableReinitialize: true,
        validate: (values) => {
            const errors: any = {};

            if (!FormValidator.hasValue(values.address)) {
                errors.address = "Address is required";
            }

            if (!FormValidator.hasValue(values.name)) {
                errors.name = "Name is required";
            }

            return errors;
        },
        onSubmit: async (values) => {
            submitProfileDetails(values);
            try {
                await Keyboard.hide();
            } catch (error) {
                console.log('Error in hiding keyboard ', error);
            }
        }
    });

    function submitProfileDetails(profileDetail: ProfileDetails) {
        updateProfileDetails(profileDetail).then(res => {
            if (res.isSuccess) presentSuccess("Successfully changed")
            else if (res.errors) presentFailure("Error in profile update")
        })
    }

    return (
        <IonPage>
            <SecondaryHeader
                title='Profile Details'/>
            <PrimaryContainer className={styles.container}>
                <form
                    className={`${styles.form} ion-padding`}
                    onSubmit={formManager.handleSubmit}
                    onKeyDown={(event) =>
                        FormHelper.handleKeyDown(event, formManager.handleSubmit)
                    }>
                    <FormField>
                        <PrimaryTypography size='m' customClassName={styles.label}>Name</PrimaryTypography>
                        <SecondaryInput
                            placeholder='Please enter your name'
                            name="name"
                            onChange={formManager.handleChange}
                            value={formManager.values.name}
                        />
                        {formManager.touched.name && formManager.errors.name ? (
                            <InputError error={formManager.errors.name}/>
                        ) : null}
                    </FormField>

                    <FormField>
                        <PrimaryTypography size='m' customClassName={styles.label}>Address</PrimaryTypography>
                        <SecondaryInput
                            placeholder='Please enter your address'
                            name="address"
                            onChange={formManager.handleChange}
                            value={formManager.values.address}
                        />
                        {formManager.touched.address && formManager.errors.address ? (
                            <InputError error={formManager.errors.address}/>
                        ) : null}
                    </FormField>

                    <FormField>
                        <PrimaryTypography size='m' customClassName={styles.label}>Email</PrimaryTypography>
                        <SecondaryInput
                            placeholder='Email'
                            name="email"
                            onChange={formManager.handleChange}
                            value={formManager.values.email ?? ''}
                            disabled
                        />
                        {formManager.touched.email && formManager.errors.email ? (
                            <InputError error={formManager.errors.email}/>
                        ) : null}
                    </FormField>

                    <FormField className={styles.fieldWrapper}>
                        <PrimaryTypography size='m' customClassName={styles.label}>Wallet Address</PrimaryTypography>
                        <SecondaryInput
                            placeholder='Wallet address'
                            name="walletAddress"
                            onChange={formManager.handleChange}
                            value={formManager.values.walletAddress ?? ''}
                            disabled
                        />
                        {formManager.touched.walletAddress && formManager.errors.walletAddress ? (
                            <InputError error={formManager.errors.walletAddress}/>
                        ) : null}
                    </FormField>

                    <PrimaryAccordion
                        style='primary'
                        accordionItem={formManager.values.socialAccounts ?
                            formManager.values.socialAccounts.map((socialAccount, index) => {
                                return {
                                    icon: socialAccountTypes?.find(socialAccountType => socialAccountType.key === socialAccount.type)!.logoUrl!,
                                    value: index.toString(),
                                    label: socialAccountTypes?.find(socialAccountType => socialAccountType.key === socialAccount.type)!.name!,
                                    content: (
                                        <>
                                            <FormField className={styles.fieldWrapper}>
                                                <PrimaryTypography size='m'
                                                                   customClassName={styles.label}>Username</PrimaryTypography>
                                                <SecondaryInput
                                                    placeholder='Username'
                                                    name={`socialAccounts[${index}].username`}
                                                    onChange={formManager.handleChange}
                                                    value={socialAccount.username ?? ''}
                                                />
                                            </FormField>

                                            <FormField className={styles.fieldWrapper}>
                                                <PrimaryTypography size='m' customClassName={styles.label}>Profile
                                                    Url</PrimaryTypography>
                                                <SecondaryInput
                                                    placeholder='Profile Url'
                                                    name={`socialAccounts[${index}].profileUrl`}
                                                    onChange={formManager.handleChange}
                                                    value={socialAccount.profileUrl ?? ''}
                                                />
                                            </FormField>
                                        </>
                                    )
                                }
                            }) : []}
                    />
                    <div className={styles.buttonWrapper}>
                        <PrimaryButton
                            size='l'
                            expand='block'
                            onClick={() => formManager.submitForm()}
                            loading={isSubmitting}>
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Profile