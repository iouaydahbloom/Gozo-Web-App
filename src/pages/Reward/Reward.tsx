import { IonPage, useIonViewWillEnter } from '@ionic/react'
import { useState } from 'react';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import useReward from '../../hooks/useReward';
import { Reward } from '../../models/reward';
import PrimaryRewardGrid from './PrimaryRewardGrid/PrimaryRewardGrid';
import ReferralBanner from './ReferralBanner/ReferralBanner';

const Rewards: React.FC = () => {
    const [rewards, setRewards] = useState<Reward[]>([])
    const { fetchRewards, isLoadingRewards } = useReward()

    function getRewards() {
        fetchRewards().then(rewards => {
            if (rewards) setRewards(rewards)
        })
    }

    useIonViewWillEnter(() => {
        getRewards()
    }, [])
    return (
        <IonPage>
            <TertiaryHeader title='Rewards' className='ion-text-center' />
            <PrimaryContainer className='ion-text-center'>
                <ReferralBanner />
                {!isLoadingRewards ?
                    <PrimaryRewardGrid
                        headers={[
                            {
                                text: 'Reward',
                                style: {flex: 0.3}
                            },
                            {
                                text: 'Description'
                            },
                            {
                                text: 'Date',
                                style: { flex: 0.7,}
                            }
                        ]}
                        data={rewards}
                    />
                    :
                    <PageLoader />}
            </PrimaryContainer>
        </IonPage>
    )
}

export default Rewards