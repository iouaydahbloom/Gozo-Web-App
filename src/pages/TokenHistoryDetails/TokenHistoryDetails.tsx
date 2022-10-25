import { IonPage } from "@ionic/react"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"

const TokenHistoryDetails: React.FC = () => {
  return (
    <IonPage>
      <SecondaryHeader
        title='Transaction Details' />
      <PrimaryContainer >
      TokenHistoryDetails
      </PrimaryContainer>
    </IonPage>
  )
}

export default TokenHistoryDetails