import { useMemo } from 'react'
import PrimaryAccordion, { AccordionItemData } from '../../../components/accordions/PrimaryAccordion/PrimaryAccordion'
import SectionLoader from '../../../components/loaders/section-loader/SectionLoader'
import { EarningReward } from '../../../models/earningReward'

interface Props {
  earnData: EarningReward[],
  userEarningsList: string[],
  isLoading: boolean
}

const EarnReward: React.FC<Props> = ({ earnData, isLoading, userEarningsList }) => {
  const earningOpts = useMemo(() => {
    if (earnData.length !== 0) {
      return earnData.map((item) => {
        let disabled = false
        if(userEarningsList.includes(item.id) && item.type === 'not_continuous') {
          disabled = true
        }
        return new AccordionItemData(item.id, item.name, <>{item.description} <a href={item.url}>{item.url}</a></>, item.logoUrl, disabled)
      })
    }
    return []
  }, [earnData])

  return (
    <div>
      {isLoading ?
        <SectionLoader />
        :
        <PrimaryAccordion
          accordionItemData={earningOpts}
          style='primary'
        />
      }

    </div>
  )
}

export default EarnReward