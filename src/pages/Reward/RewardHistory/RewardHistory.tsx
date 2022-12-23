import React from 'react'
import { useHistory } from 'react-router';
import { Reward } from '../../../models/reward'
import RewardGrid from '../RewardGrid/RewardGrid'

interface Props {
    rewards: Reward[],
    isLoading: boolean,
    reload: () => void
}

const RewardHistory: React.FC<Props> = ({rewards, isLoading, reload}) => {
    const { push } = useHistory();

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
            reload={reload}
        />
    )
}

export default RewardHistory