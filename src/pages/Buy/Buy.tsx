import { IonPage, useIonViewWillEnter } from '@ionic/react'
import { useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import { InfiniteScrollPagination } from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import SectionPlaceholder from '../../components/sections/SectionPlaceholder/SectionPlaceholder';
import useGiftCard from '../../hooks/useGiftCard';
import useServerPagination from '../../hooks/useServerPagination';
import { Filter } from '../../models/data/filter';
import { GiftCard } from '../../models/giftCard';
import GiftCardItem from './GiftCardItem/GiftCardItem';

const Buy: React.FC = () => {

    const { fetchGiftCards } = useGiftCard();
    const {
        data: giftCards,
        isLoading,
        fetchData,
        hasMore,
        loadMore
    } = useServerPagination<GiftCard, Filter>({
        getData: fetchGiftCards as any
    })

    const onRefresh = useCallback((): Promise<any> => {
        return fetchData();
    }, [])

    useIonViewWillEnter(() => {
        onRefresh();
    })

    return (
        <IonPage>
            <TertiaryHeader title='Buy' className='ion-text-center' />
            <PrimaryContainer className='ion-padding' scrollYAxis={false} isRefreshable onRefresh={onRefresh}>
                <Virtuoso
                    className="ion-content-scroll-host"
                    style={{ height: "83vh" }}
                    totalCount={1}
                    itemContent={() => {
                        return (
                            <>
                                {isLoading ?
                                    <PageLoader />
                                    :
                                    giftCards && giftCards.length !== 0 ?
                                        giftCards.map((giftCard, index) => <GiftCardItem key={index} giftCard={giftCard} />)
                                        :
                                        <SectionPlaceholder
                                            title='No Gift Cards Found'
                                        />
                                }
                            </>
                        )
                    }}
                    components={{
                        Footer: () => InfiniteScrollPagination(loadMore, !hasMore)
                    }}>
                </Virtuoso>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy