import { IonPage } from '@ionic/react'
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import UnderConstruction from '../../components/sections/UnderConstruction/UnderConstruction';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import styles from './buy.module.scss'

const Buy: React.FC = () => {
    return (
        <IonPage>
            <PrimaryContainer className='ion-text-center ion-padding' >
                <UnderConstruction 
                    description='We are in the process of creating this page for you. Don’t miss out on our buy section'
                    />
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy