import {IonCol, IonGrid, IonPage, IonRow, useIonViewWillEnter} from '@ionic/react'
import React, {useCallback} from 'react';
import {Virtuoso} from 'react-virtuoso';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import {InfiniteScrollPagination} from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import SectionPlaceholder from '../../components/sections/SectionPlaceholder/SectionPlaceholder';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useGiftCard from '../../hooks/giftCard/useGiftCard';
import useServerPagination from '../../hooks/useServerPagination';
import {Filter} from '../../models/data/filter';
import {GiftCard} from '../../models/giftCard';
import GiftCardItem from './GiftCardItem/GiftCardItem';
import styles from './buy.module.scss';
import useAuthentication from '../../hooks/useAuthentication';

const Buy: React.FC = () => {

    const {isAuthenticated} = useAuthentication();
    const {fetchGiftCards} = useGiftCard({});
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
    }, [isAuthenticated])

    // useIonViewWillEnter(() => {
    //     onRefresh();
    // }, [isAuthenticated])

    return (
        <IonPage>
            <TertiaryHeader title='Buy' className='ion-text-center'/>
            <PrimaryContainer className='ion-padding' scrollYAxis={false} isRefreshable onRefresh={onRefresh}>
                <Virtuoso
                    className="ion-content-scroll-host"
                    style={{height: "83vh"}}
                    totalCount={1}
                    itemContent={() => {
                        return (
                            <>
                                {isLoading ?
                                    <PageLoader/>
                                    :
                                    giftCards && giftCards.length !== 0 ?
                                        <IonGrid className={styles.giftCards}>
                                            <IonRow>
                                                <IonCol>
                                                    <PrimaryTypography size='m' isBold>GIFT CARDS</PrimaryTypography>
                                                </IonCol>
                                            </IonRow>
                                            <IonRow>
                                                {
                                                    giftCards.map((giftCard, index) =>
                                                        <IonCol key={index} size="6">
                                                            <GiftCardItem key={index} giftCard={giftCard}/>
                                                        </IonCol>
                                                    )
                                                }
                                            </IonRow>
                                        </IonGrid>
                                        :
                                        <SectionPlaceholder
                                            logoUrl='assets/image/no-gift-card.svg'
                                            description='There are no featured gift cards available yet'
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