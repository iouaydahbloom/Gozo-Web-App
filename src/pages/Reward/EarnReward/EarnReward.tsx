import PrimaryAccordion, { AccordionItemData } from '../../../components/accordions/PrimaryAccordion/PrimaryAccordion'
import styles from './earnReward.module.scss'

interface Props {
    earnData: AccordionItemData[]
}

const EarnReward: React.FC<Props> = ({earnData}) => {
  return (
    <div>
        <PrimaryAccordion accordionItemData={earnData} className={styles.EarnReward}/>
    </div>
  )
}

export default EarnReward