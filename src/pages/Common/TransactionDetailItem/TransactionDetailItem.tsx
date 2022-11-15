import PrimaryTag from '../../../components/tags/PrimaryTag/PrimaryTag'
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography'
import { defaultColorType } from '../../../types/defaultColorType'
import styles from './transactionDetailItem.module.scss'

interface Props {
  header: string,
  text: string,
  textColor?: defaultColorType
}

const TransactionDetailItem: React.FC<Props> = ({ header, text, textColor = 'light' }) => {
  return (
    <div className={styles.container}>
      <PrimaryTag className={styles.tag}>
        {header}
      </PrimaryTag>
      <PrimaryTypography color={textColor} customClassName={styles.text}>
        {text}
      </PrimaryTypography>
    </div>
  )
}

export default TransactionDetailItem