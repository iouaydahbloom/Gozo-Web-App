import { IonPage } from '@ionic/react'
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';

const Buy: React.FC = () => {
    return (
        <IonPage>
            <TertiaryHeader title='Buy' className='ion-text-center' />
            <PrimaryContainer className='ion-text-center'>
                <PrimaryTypography >
                    Buy page
                </PrimaryTypography>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy