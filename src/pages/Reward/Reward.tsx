import { IonPage, useIonViewWillEnter } from '@ionic/react'
import { useState } from 'react';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import { RewardDTO } from '../../dto/RewardDTO';
import useCloud from '../../hooks/useCloud';
import { Reward } from '../../models/reward';
import { cloudFunctionName } from '../../moralis/cloudFunctionName';
import RewardListing from './RewardListing/RewardListing'

const Rewards: React.FC = () => {
    const [rewards, setRewards] = useState<Reward[]>([])
    const { run } = useCloud();

    function fetchRewards() {
        run(cloudFunctionName.reward,
            null,
            (result: RewardDTO[]) => Reward.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setRewards(result.data)
            })
    }

    useIonViewWillEnter(() => {
        fetchRewards()
    }, [])
    return (
        <IonPage>
            <TertiaryHeader title='Rewards' className='ion-text-center'/>
            <PrimaryContainer className='ion-text-center'>
                <RewardListing rewards={rewards} />
            </PrimaryContainer>
        </IonPage>
    )
}

export default Rewards