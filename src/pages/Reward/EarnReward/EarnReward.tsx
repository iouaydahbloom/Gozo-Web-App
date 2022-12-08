import { useMemo } from 'react'
import PrimaryAccordion, { AccordionItem } from '../../../components/accordions/PrimaryAccordion/PrimaryAccordion'
import SectionLoader from '../../../components/loaders/section-loader/SectionLoader'
import { EarningReward } from '../../../models/earningReward'

interface Props {
  earnData: EarningReward[],
  userEarningsList: string[],
  isLoading: boolean
}

const EarnReward: React.FC<Props> = ({ earnData, isLoading, userEarningsList }) => {
  const earnings = useMemo(() => {
    if (earnData.length !== 0) {
      return earnData.map((item) => {
        let disabled = false
        if(userEarningsList.includes(item.id) && item.type === 'not_continuous') {
          disabled = true
        }
        return new AccordionItem(item.id, item.name, <>{item.description} <a href={item.url}>{item.url}</a></>, item.logoUrl, disabled)
      })
    }
    return []
  }, [earnData, userEarningsList])

  return (
    <div>
      {isLoading ?
        <SectionLoader />
        :
        <PrimaryAccordion
          accordionItem={earnings}
          style='primary'
        />
      }

    </div>
  )
}

export default EarnReward