import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import styles from './referralBanner.module.scss';

interface Props {

}

const ReferralBanner: React.FC<Props> = ({}) => {


    return (
        <div className={styles.container} >
            <img src='/assets/image/gozo-element.png' className={styles.startImg}/>
            <div className={styles.innerContainer}>
                <PrimaryTypography size='m' customClassName={styles.description}>Send a free spin to a friend today!</PrimaryTypography>
            </div>
            <img src='/assets/image/hands-icon.png' className={styles.endImg}/>
        </div>
    )
}

export default ReferralBanner;