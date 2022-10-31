import { IonPage } from "@ionic/react"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"
import DetailItem from "./DetailItem/DetailItem"

interface Props {
  details: any[]
}

const LoyaltyProgramHistoryDetails: React.FC<Props> = ({details}) => {
  return (
    <IonPage>
      <SecondaryHeader
        title='Transaction Details' />
      <PrimaryContainer >
        {details && details.map((detail) => {
          return <DetailItem header={detail.header} text={detail.text}/>
        })}
      </PrimaryContainer>
    </IonPage>
  )
}

export default LoyaltyProgramHistoryDetails