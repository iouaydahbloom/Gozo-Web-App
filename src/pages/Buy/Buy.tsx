import { IonPage } from '@ionic/react'
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import styles from './buy.module.scss'

const Buy: React.FC = () => {
    return (
        <IonPage>
            <PrimaryContainer className='ion-text-center ion-padding' >
                <div className={styles.containerContent}>
                    <img src='assets/image/coming-soon.svg'/>
                    <PrimaryTypography size='xxl'>
                        Coming soon!
                    </PrimaryTypography>
                    <br/>
                    <div>
                    <PrimaryTypography size='m'>
                        We are in the process of creating this page for you.
                        Don’t miss out on our buy section
                    </PrimaryTypography>
                    </div>
                </div>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy