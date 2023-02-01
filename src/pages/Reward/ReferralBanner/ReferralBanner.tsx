import PrimarySlider from '../../../components/sliders/PrimarySlider/PrimarySlider';
import styles from './referralBanner.module.scss';

interface SlideProps {
    image: string,
    href: string
}

const ReferralBanner: React.FC = () => {

    const Slide = ({ image, href }: SlideProps) => {
        return (
            <a href={href} className={styles.slide} style={{ backgroundImage: `url(${image})` }}/>
        )
    }

    return (
        <PrimarySlider
            customStyle={styles.slider}
            autoPlay
            slides={[
                <Slide
                    image='assets/image/wayaway.png'
                    href="https://tp.media/click?shmarker=407798&promo_id=7779&source_type=banner&type=click&campaign_id=200&trs=207450" />,
                <Slide
                    image='assets/image/economybooking.png'
                    href="https://tp.media/click?shmarker=407798&promo_id=8155&source_type=banner&type=click&campaign_id=10&trs=207450" />,
                <Slide
                    image='assets/image/tripcom.png'
                    href='https://tp.media/click?shmarker=407798&promo_id=5046&source_type=banner&type=click&campaign_id=121&trs=207450' />,
                    <Slide
                    image='assets/image/chearcarrentals.png'
                    href='https://tp.media/click?shmarker=407798&promo_id=4340&source_type=banner&type=click&campaign_id=117&trs=207450' />
            ]}
        />
    )
}

export default ReferralBanner;
