import { IonPage, isPlatform } from '@ionic/react'
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import { FormField } from '../../components/forms/FormField/FormField';
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { FormHelper, FormValidator } from '../../helpers/forms/form.helper';
import useProfile from '../../hooks/useProfile';
import { ProfileDetails } from '../../models/profileDetails';
import { useFormik } from "formik";
import InputError from '../../components/inputs/InputError/InputError';
import styles from './profile.module.scss'
import useToast from '../../hooks/useToast';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import SecondaryInput from '../../components/inputs/SecondaryInput/SecondaryInput';
import { Keyboard } from '@capacitor/keyboard';
import PrimaryAccordion from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';

const Profile: React.FC = () => {

    const { profileDetails, updateProfileDetails, isLoading } = useProfile();
    const { presentSuccess, presentFailure } = useToast();
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
        onSubmit: (values) => {
            submitProfileDetails(new ProfileDetails(values.name, values.address))
            if (isPlatform('mobileweb') || isPlatform('pwa')) return
            Keyboard.hide();
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
                title='Profile Details' />
            <PrimaryContainer className={styles.container}>
                {!isLoading ?
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
                                <InputError error={formManager.errors.name} />
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
                                <InputError error={formManager.errors.address} />
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
                                <InputError error={formManager.errors.email} />
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
                                <InputError error={formManager.errors.walletAddress} />
                            ) : null}
                        </FormField>

                        <PrimaryAccordion
                            type='primary'
                            accordionItemData={formManager.values.socialAccounts ?
                                formManager.values.socialAccounts.map((sa, index) => {
                                    return {
                                        icon: 'assets/icon/transaction-history.svg',
                                        value: index.toString(),
                                        label: 'Facebook',
                                        content: (
                                            <>
                                                <FormField className={styles.fieldWrapper}>
                                                    <PrimaryTypography size='m' customClassName={styles.label}>Username</PrimaryTypography>
                                                    <SecondaryInput
                                                        placeholder='Username'
                                                        name={`socialAccounts[${index}].username`}
                                                        onChange={formManager.handleChange}
                                                        value={sa.username ?? ''}
                                                        disabled
                                                    />
                                                </FormField>

                                                <FormField className={styles.fieldWrapper}>
                                                    <PrimaryTypography size='m' customClassName={styles.label}>Username</PrimaryTypography>
                                                    <SecondaryInput
                                                        placeholder='Username'
                                                        name={`socialAccounts[${index}].username`}
                                                        onChange={formManager.handleChange}
                                                        value={sa.username ?? ''}
                                                        disabled
                                                    />
                                                </FormField>
                                            </>
                                        )
                                    }
                                }) : []}
                        />
                        <div className={styles.buttonWrapper}>
                            <PrimaryButton
                                size='m'
                                expand='block'
                                onClick={() => formManager.submitForm()}
                                loading={isLoading}>
                                Save
                            </PrimaryButton>
                        </div>
                    </form>
                    :
                    <PageLoader />}
            </PrimaryContainer>
        </IonPage>
    )
}

export default Profile