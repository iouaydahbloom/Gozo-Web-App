import PrimaryAccordion, { AccordionItemData } from '../../../components/accordions/PrimaryAccordion/PrimaryAccordion'
import styles from './earnTab.module.scss'

interface Props {
    earnData: AccordionItemData[]
}

const EarnTab: React.FC<Props> = ({earnData}) => {
  return (
    <div>
        <PrimaryAccordion accordionItemData={earnData} className={styles.earnTab}/>
    </div>
  )
}

export default EarnTab