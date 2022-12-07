import PrimaryAccordion, { AccordionItemData } from '../../../components/accordions/PrimaryAccordion/PrimaryAccordion'

interface Props {
  earnData: AccordionItemData[]
}

const EarnReward: React.FC<Props> = ({ earnData }) => {
  return (
    <div>
      <PrimaryAccordion accordionItemData={earnData} style='primary' />
    </div>
  )
}

export default EarnReward