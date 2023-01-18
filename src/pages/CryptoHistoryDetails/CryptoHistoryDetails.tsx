import { IonPage, useIonViewWillEnter } from "@ionic/react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader"
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer"
import PageLoader from "../../components/loaders/PageLoader/PageLoader"
import { formatDate } from "../../helpers/dateManagment"
import { CryptoTransfer } from "../../models/assets/ERC20Transfer"
import { useDapp } from "../../providers/DappProvider/DappProvider"
import TransactionDetailItem from "../Common/TransactionDetailItem/TransactionDetailItem"

const CryptoHistoryDetails: React.FC = () => {

  const location = useLocation();
  const transaction = location.state as CryptoTransfer
  const [historyField, setHistoryField] = useState<CryptoTransfer>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { walletAddress } = useDapp();

  const keys = [
    { key: 'address', label: 'Address' },
    { key: 'blockHash', label: 'Block Hash' },
    { key: 'blockNumber', label: 'Block Number' },
    { key: 'blockTimestamp', label: 'Block Timestamp' },
    { key: 'fromAddress', label: 'From Address' },
    { key: 'fromAddress', label: 'From Address' },
    { key: 'toAddress', label: 'To Address' },
    { key: 'transactionHash', label: 'Transaction Hash' },
    { key: 'value', label: 'amount' },
  ]

  const transformData = (key: string, historyField: CryptoTransfer) => {
    return key === 'blockTimestamp' ?
      formatDate(historyField[key as keyof CryptoTransfer], 'ddd Do MMM, YYYY h:mm a')
      :
      historyField[key as keyof CryptoTransfer]
  }

  useIonViewWillEnter(() => {
    setHistoryField(transaction)
  }, [])

  useEffect(() => {
    if (historyField) setIsLoading(false)
  }, [historyField])


  return (
    <IonPage>
      <SecondaryHeader
        title='Transaction Details' />
      <PrimaryContainer >
        {!isLoading ?
          historyField &&
          Object.keys(historyField)
            //@ts-ignore
            .filter((item) => historyField[item] && keys.some(event => event.key === item))
            .map((key, index) => {
              const keyObj = keys.find((item) => item.key === key)
              return <TransactionDetailItem
                key={index}
                header={keyObj?.label ?? ''}
                text={transformData(key, historyField)}
                textColor={
                  (key === 'fromAddress' && walletAddress === historyField[key as keyof CryptoTransfer]) ?
                    'danger'
                    :
                    (key === 'toAddress' && walletAddress === historyField[key as keyof CryptoTransfer]) ?
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

export default CryptoHistoryDetails;