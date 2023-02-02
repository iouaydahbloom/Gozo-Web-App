import {IonPage} from '@ionic/react';
import {useHistory} from 'react-router';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryFooter from '../../components/layout/PrimaryFooter/PrimaryFooter';
import PrimarySlider from '../../components/sliders/PrimarySlider/PrimarySlider';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import {AppRoutes} from '../../constants/appRoutes';
import useTabMenuHider from '../../hooks/useTabMenuHider';
import styles from './onBoarding.module.scss';

interface SlideProps {
    image: string,
    title: string,
    description: string
}

const OnBoarding: React.FC = () => {
    const {replace} = useHistory();
    useTabMenuHider();

    const OnBoardingSlide = ({image, title, description}: SlideProps) => {
        return (
            <div>
                <img src={image} alt=''/>
                <PrimaryTypography isBold size='xxl' customClassName={styles.title}>
                    {title}
                </PrimaryTypography>
                <PrimaryTypography size='m'>
                    {description}
                </PrimaryTypography>
            </div>
        )
    }

    return (
        <IonPage>
            <PrimaryContainer className={styles.onBoardingContainer}>
                <PrimarySlider
                    slides={[
                        <OnBoardingSlide
                            image='assets/icon/onboarding-1.svg'
                            title='Wallet & Loyalty Points Clearinghouse'
                            description='Consolidate and Exchange all your loyalty reward points from various providers into a single wallet.'/>,
                        <OnBoardingSlide
                            image='assets/icon/onboarding-2.svg'
                            title='Play to Earn'
                            description='Play and Win Valuable Prizes'/>,
                        <OnBoardingSlide
                            image='assets/icon/onboarding-3.svg'
                            title='BlockChain-Based Rewards with Gozo token'
                            description=''/>
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
