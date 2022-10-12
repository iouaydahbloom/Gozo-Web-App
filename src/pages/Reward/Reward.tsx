import { IonPage, useIonViewWillEnter } from '@ionic/react'
import { useState } from 'react';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import useReward from '../../hooks/useReward';
import { Reward } from '../../models/reward';
import ReferralBanner from './ReferralBanner/ReferralBanner';
import RewardListing from './RewardListing/RewardListing'

const Rewards: React.FC = () => {
    const [rewards, setRewards] = useState<Reward[]>([])
    const { fetchRewards } = useReward()

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
                <RewardListing rewards={rewards} />
            </PrimaryContainer>
        </IonPage>
    )
}

export default Rewards