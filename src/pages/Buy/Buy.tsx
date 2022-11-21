import { IonPage } from '@ionic/react'
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import SectionPlaceholder from '../../components/sections/SectionPlaceholder/SectionPlaceholder';

const Buy: React.FC = () => {
    return (
        <IonPage>
            <PrimaryContainer className='ion-text-center ion-padding' >
                <SectionPlaceholder
                    title='Coming Soon!'
                    description='We are in the process of creating this page for you. Don’t miss out on our buy section'
                    logoUrl='assets/image/coming-soon.svg'
                />
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy