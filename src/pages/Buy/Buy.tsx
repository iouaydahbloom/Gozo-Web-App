import { IonPage, useIonViewWillEnter } from '@ionic/react'
import { useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import { InfiniteScrollPagination } from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import SectionLoader from '../../components/loaders/section-loader/SectionLoader';
import useGiftCard from '../../hooks/useGiftCard';
import useServerPagination from '../../hooks/useServerPagination';
import { Filter } from '../../models/data/filter';
import { GiftCard } from '../../models/giftCard';
import styles from './buy.module.scss'
import GiftCardItem from './GiftCardItem/GiftCardItem';


const Buy: React.FC = () => {
    const { fetchGiftCards } = useGiftCard()
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
        return Promise.all([
            fetchData()
        ])
    }, [])

    useIonViewWillEnter(() => {
        onRefresh();
    })

    console.log("isloading", isLoading)
    return (
        <IonPage>
            <TertiaryHeader title='Buy' className='ion-text-center' />
            <PrimaryContainer className='ion-padding' scrollYAxis={false} isRefreshable onRefresh={onRefresh}>
                <Virtuoso
                    className="ion-content-scroll-host"
                    style={{ height: "83vh", }}
                    totalCount={1}
                    itemContent={() => {
                        return (
                            <>
                                {isLoading ?
                                    <SectionLoader />
                                    :
                                    giftCards && giftCards.length !== 0 ? (giftCards.map((giftCard, index) => {
                                        return <GiftCardItem key={index} giftCard={giftCard} />
                                    }))
                                    : 
                                    <div>
                                        No Data
                                    </div>

                                }
                            </>
                        )
                    }
                    }
                    components={{
                        Footer: () => InfiniteScrollPagination(loadMore, !hasMore)
                    }}
                >
                </Virtuoso>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy