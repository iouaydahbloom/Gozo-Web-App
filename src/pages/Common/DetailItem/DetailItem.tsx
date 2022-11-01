import PrimaryTag from '../../../components/tags/PrimaryTag/PrimaryTag'
import styles from './detailItem.module.scss'

interface Props {
  header: string,
  text: string
}

const DetailItem: React.FC<Props> = ({ header, text }) => {
  return (
    <div className={styles.container}>
      <PrimaryTag className={styles.tag}>
        {header}
      </PrimaryTag>
      <span className={styles.text}>
        {text}
      </span>
    </div>
  )
}

export default DetailItem