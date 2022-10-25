import { IonPage } from "@ionic/react"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"

const LoyaltyProgramHistoryDetails: React.FC = () => {
  console.log("enteredd")
  return (
    <IonPage>
      <SecondaryHeader
        title='Transaction Details' />
      <PrimaryContainer >
        LoyaltyProgramHistoryDetails
      </PrimaryContainer>
    </IonPage>
  )
}

export default LoyaltyProgramHistoryDetails