import { IonPage } from "@ionic/react"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"
import PageLoader from "../../components/loaders/PageLoader/PageLoader"
import useSearchParams from "../../hooks/useSearchParams"
import useProgramsTransactionHistory from "../../hooks/useProgramsTransactionHistory"
import { LoyaltyMemberHistory } from "../../models/loyaltyMember"
import TransactionDetailItem from "../Common/TransactionDetailItem/TransactionDetailItem"
import { useEffect } from "react"


const LoyaltyProgramHistoryDetails: React.FC = () => {
  const search = useSearchParams();
  const id = search.get('transaction_id')
  const { historyField, isLoadingHistory, getTransaction } = useProgramsTransactionHistory()

  const keys = [
    { key: 'amount', label: 'Amount' },
    { key: 'completed_at', label: 'Completed At' },
    { key: 'created_at', label: 'Created At' },
    { key: 'id', label: 'Id' },
    { key: 'loyalty_currency', label: 'Loyalty Currency' },
    { key: 'reason', label: 'Reason' },
    { key: 'status', label: 'Status' },
    { key: 'sub_type', label: 'Sub Type' },
    { key: 'type', label: 'Type' },
  ]

  useEffect(() => {
    if(id) getTransaction(id)
  }, [id])
  

  return (
    <IonPage>
      <SecondaryHeader
        title='Transaction Details' />
      <PrimaryContainer >
        {!isLoadingHistory ?
          historyField &&
          Object.keys(historyField).filter((item) => keys.some(event => event.key === item)).map((key, index) => {
            const keyObj = keys.find((item) => item.key === key)
            return <TransactionDetailItem
              key={index}
              header={keyObj?.label ?? ''}
              text={key === 'amount' ?
                LoyaltyMemberHistory.isBalanceSubtracted(historyField) ?
                  `- ${historyField[key as keyof LoyaltyMemberHistory]}`
                  :
                  `+ ${historyField[key as keyof LoyaltyMemberHistory]}`
                :
                historyField[key as keyof LoyaltyMemberHistory]
              }
              textColor={key === 'amount' ?
                LoyaltyMemberHistory.isBalanceSubtracted(historyField) ? 'danger' : 'success'
                :
                undefined}
            />
          })
          :
          <PageLoader />
        }
      </PrimaryContainer>
    </IonPage>
  )
}

export default LoyaltyProgramHistoryDetails