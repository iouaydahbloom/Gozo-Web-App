import React from 'react'
import { useHistory } from 'react-router'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton'
import SectionPlaceholder from '../../../components/sections/SectionPlaceholder/SectionPlaceholder'
import { AppRoutes } from '../../../constants/appRoutes'
import { Reward } from '../../../models/reward'
import RewardGrid from '../RewardGrid/RewardGrid'

interface Props {
    rewards: Reward[],
    isLoading: boolean,
    reload: () => void
}

const RewardHistory: React.FC<Props> = ({rewards, isLoading, reload}) => {
    const { push } = useHistory()

    const Placeholder = () => {
        return (
            <SectionPlaceholder
            description='You have no rewards available yet'
            logoUrl='assets/image/no-rewards.svg'
            renderActions={() => <PrimaryButton onClick={() => push(AppRoutes.spinner)}>play now</PrimaryButton>}
        />
        )
    }

    return (
        <RewardGrid
            headers={[
                {
                    text: 'Reward',
                    style: { flex: 0.3 }
                },
                {
                    text: 'Description'
                },
                {
                    text: 'Status',
                    style: { flex: 0.7, }
                }
            ]}
            data={rewards}
            isLoading={isLoading}
            placeholder={<Placeholder/>}
            reload={reload}
        />
    )
}

export default RewardHistory