import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react"

// interface Props {
//     loadMore: (ev: any) => void,
//     isInfiniteDisabled: boolean
// }

export const InfiniteScrollPagination = (loadMore: (ev: any) => void, isInfiniteDisabled: boolean) => {
    return (
        <IonInfiniteScroll
        onIonInfinite={loadMore}
        threshold="100px"
        disabled={isInfiniteDisabled}
    >
        <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
        ></IonInfiniteScrollContent>
    </IonInfiniteScroll>
    )
  }