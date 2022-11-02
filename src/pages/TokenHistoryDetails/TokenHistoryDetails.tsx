import { IonPage, useIonViewWillEnter } from "@ionic/react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"
import PageLoader from "../../components/loaders/PageLoader/PageLoader"
import { LoyaltyMemberHistory } from "../../models/loyaltyMember"
import { useDapp } from "../../providers/DappProvider/DappProvider"
import DetailItem from "../Common/DetailItem/DetailItem"


const TokenHistoryDetails: React.FC = () => {
  const location = useLocation();
  const transaction = location.state
  const [historyField, setHistoryField] = useState<LoyaltyMemberHistory>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { walletAddress } = useDapp();

  const keys = [
    {key: 'address', label: 'Address'},
    {key: 'block_hash', label: 'Block Hash'},
    {key: 'block_number', label: 'Block Number'},
    {key: 'block_timestamp', label: 'Block Timestamp'},
    {key: 'from_address', label: 'From Address'},
    {key: 'from_address', label: 'From Address'},
    {key: 'to_address', label: 'To Address'},
    {key: 'transaction_hash', label: 'Transaction Hash'},
    {key: 'value', label: 'Value'},
  ]

  useIonViewWillEnter(() => {
    setHistoryField(transaction as LoyaltyMemberHistory)
  })

  useEffect(() => {
    if(historyField) setIsLoading(false)
  }, [historyField])
  

  return (
    <IonPage>
      <SecondaryHeader
        title='Transaction Details' />
      <PrimaryContainer >
        {!isLoading ?
          historyField &&
          Object.keys(historyField).filter((item) => keys.some(event => event.key === item)).map((key, index) => {
            const keyObj = keys.find((item) => item.key === key)
            return <DetailItem 
              key={index} 
              header={keyObj?.label ?? ''} 
              text={historyField[key as keyof LoyaltyMemberHistory]} 
              textColor={
                (key === 'from_address' && walletAddress === historyField[key as keyof LoyaltyMemberHistory]) ?
                'danger'
                :
                (key === 'to_address' && walletAddress === historyField[key as keyof LoyaltyMemberHistory]) ? 
                'success'
                :
                undefined
              }
              />
          })
          :
          <PageLoader />
        }
      </PrimaryContainer>
    </IonPage>
  )
}

export default TokenHistoryDetails