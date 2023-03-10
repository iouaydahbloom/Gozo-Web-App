import { IonPage } from "@ionic/react"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"
import PageLoader from "../../components/loaders/PageLoader/PageLoader"
import useSearchParams from "../../hooks/useSearchParams"
import useProgramsTransactionHistory from "../../hooks/programsTransactionHistory/useProgramsTransactionHistory"
import { LoyaltyMemberHistory } from "../../models/loyaltyMember"
import TransactionDetailItem from "../Common/TransactionDetailItem/TransactionDetailItem"
import { useEffect } from "react"
import { formatDate } from "../../helpers/dateManagment"
import { useParams } from "react-router"


const LoyaltyProgramHistoryDetails: React.FC = () => {

  const { transactionId } = useParams<{ transactionId: string }>();
  const { historyField, isLoadingHistory, getTransaction } = useProgramsTransactionHistory({transactionId})

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

  const transformData = (key: string, historyField: LoyaltyMemberHistory) => {
    return key === 'amount' ?
      LoyaltyMemberHistory.isBalanceSubtracted(historyField) ?
        `- ${historyField[key as keyof LoyaltyMemberHistory]}`
        :
        `+ ${historyField[key as keyof LoyaltyMemberHistory]}`
      :
      (key === 'completed_at' || key === 'created_at') ?
        formatDate(historyField[key as keyof LoyaltyMemberHistory], 'ddd Do MMM, YYYY h:mm a')
        :
        historyField[key as keyof LoyaltyMemberHistory]
  }

  // useEffect(() => {
  //   if (transactionId) getTransaction(transactionId)
  // }, [transactionId])

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
              text={transformData(key, historyField)}
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