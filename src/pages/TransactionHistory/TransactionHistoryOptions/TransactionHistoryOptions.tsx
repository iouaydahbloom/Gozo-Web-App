import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react'
import { chevronForwardOutline } from 'ionicons/icons'
import React from 'react'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import styles from './transactionHistoryOptions.module.scss';

interface Item {
  name: string,
  logo: string,
  onClick?: () => void
}

interface Props {
  items: Item[]
}

const TransactionHistoryOptions: React.FC<Props> = ({ items }) => {
  return (
    <IonGrid>
      {items.map((item, index) => (
        <IonRow
          key={index}
          className={styles.item}
          onClick={item.onClick}>
          <IonCol size='9'>
            <div className={styles.id}>
              <img alt='logo' src={item.logo} className={styles.logo} />
              <div className={styles.text}>
                <PrimaryTypography isBold>{item.name}</PrimaryTypography>
                <PrimaryTypography size='s'>Transactions</PrimaryTypography>
              </div>
            </div>
          </IonCol>

          <IonCol size='3'>
            <PrimaryTypography customClassName={styles.go}>
              <IonIcon icon={chevronForwardOutline} className={styles.icon} />
            </PrimaryTypography>
          </IonCol>
        </IonRow>
      ))}
    </IonGrid>
  )
}

export default TransactionHistoryOptions;