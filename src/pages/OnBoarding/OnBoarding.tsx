import { IonPage } from '@ionic/react';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryFooter from '../../components/layout/PrimaryFooter/PrimaryFooter';
import PrimarySlider from '../../components/sliders/PrimarySlider/PrimarySlider';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../constants/appRoutes';
import { hideOnboarding, isOnboardingShown } from '../../helpers/onboardingPreview';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import { IHideOnBoarding, OnBoardingPreviewContext } from '../../providers/OnBoardingPreviewProvider/OnBoardingPreviewProvider.context';
import styles from './onBoarding.module.scss';

interface SlideProps {
    image: string,
    title: string,
    description: string
}

const OnBoarding: React.FC = () => {
    const { replace } = useHistory();
    useTabMenuHidder();
    const { setHideOnBoarding } = useContext(OnBoardingPreviewContext) as IHideOnBoarding;

    const OnBoardingSlide = ({ image, title, description }: SlideProps) => {
        return (
            <div>
                <img src={image} />
                <PrimaryTypography isBold size='xxl' customClassName={styles.title}>
                    {title}
                </PrimaryTypography>
                <PrimaryTypography size='m'>
                    {description}
                </PrimaryTypography>
            </div>
        )
    }

    useEffect(() => {
        isOnboardingShown().then((flag) => {
            console.log("flag", flag)
            setHideOnBoarding(flag)
        });
      }, [])

    return (
        <IonPage>
            <PrimaryContainer className={styles.onBoardingContainer}>
                <PrimarySlider
                    slides={[
                        <OnBoardingSlide
                            image='assets/icon/onboarding-1.svg'
                            title='Wallet & Loyalty Points Clearinghouse'
                            description='Consolidate and Exchange all your loyalty reward points from various providers into a single wallet.' />,
                        <OnBoardingSlide
                            image='assets/icon/onboarding-2.svg'
                            title='Play to Earn'
                            description='Play and Win Valuable Prizes' />,
                        <OnBoardingSlide
                            image='assets/icon/onboarding-3.svg'
                            title='BlockChain-Based Rewards with Gozo token'
                            description='Consolidate and Exchange all your loyalty reward points from various providers into a single wallet.' />
                    ]}
                />
            </PrimaryContainer>
            <PrimaryFooter className={styles.footer}>
                <PrimaryButton
                    onClick={() => replace(AppRoutes.dashboard)}
                    expand='block'>
                    continue
                </PrimaryButton>
            </PrimaryFooter>
        </IonPage>
    )
}

export default OnBoarding;
