import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react"
import './infiniteScrollPagination.scss'

export const InfiniteScrollPagination = (loadMore: (ev: any) => void, isInfiniteDisabled: boolean) => {
    return (
        <IonInfiniteScroll
            onIonInfinite={loadMore}
            className='infiniteScroll'
            threshold="100px"
            disabled={isInfiniteDisabled}>
            <IonInfiniteScrollContent
                loadingSpinner="bubbles">
            </IonInfiniteScrollContent>
        </IonInfiniteScroll>
    )
}