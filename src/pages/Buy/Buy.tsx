import {IonCol, IonGrid, IonPage, IonRow} from '@ionic/react'
import React, {useCallback} from 'react';
import {Virtuoso} from 'react-virtuoso';
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';
import {InfiniteScrollPagination} from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer'
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import SectionPlaceholder from '../../components/sections/SectionPlaceholder/SectionPlaceholder';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useGiftCard from '../../hooks/giftCard/useGiftCard';
import GiftCardItem from './GiftCardItem/GiftCardItem';
import styles from './buy.module.scss';
import useAuthentication from '../../hooks/useAuthentication';
import usePaginatedQuery from "../../hooks/queryCaching/usePaginatedQuery";

const Buy: React.FC = () => {

    const {isAuthenticated} = useAuthentication();
    const {fetchGiftCards} = useGiftCard({});

    const paginatedQuery = usePaginatedQuery({
        identity: ['giftCardsList'],
        getData: fetchGiftCards
    });

    const onRefresh = useCallback((): Promise<any> => {
        return paginatedQuery.refetch()
    }, [isAuthenticated])

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
                                {
                                    paginatedQuery.isLoading ?
                                        <PageLoader/>
                                        :
                                        paginatedQuery.data?.pages && paginatedQuery.data?.pages.length !== 0 ?
                                            <IonGrid className={styles.giftCards}>
                                                <IonRow>
                                                    <IonCol>
                                                        <PrimaryTypography size='m' isBold>GIFT
                                                            CARDS</PrimaryTypography>
                                                    </IonCol>
                                                </IonRow>
                                                <IonRow>
                                                    {

                                                        paginatedQuery.data?.pages.map((page) =>
                                                            page?.results.map((giftCard, index) => (
                                                                <IonCol key={index} size="6">
                                                                    <GiftCardItem key={index} giftCard={giftCard}/>
                                                                </IonCol>
                                                            ))
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
                        Footer: () => InfiniteScrollPagination(paginatedQuery.fetchNextPage, !paginatedQuery.hasNextPage)
                    }}>
                </Virtuoso>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Buy