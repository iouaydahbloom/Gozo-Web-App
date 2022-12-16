import { useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { GiftCard } from "../models/giftCard";
import { GiftCardDTO } from "../dto/giftCardDTO";
import { Filter } from "../models/data/filter";
import { Pagination } from "../models/data/pagination";

const useGiftCard = () => {
    const [ giftCard, setGiftCard ] = useState<GiftCard>()
    const [ isLoading, setIsLoading ] = useState(false);
    const { run } = useCloud();

    async function fetchGiftCards(filter: Filter) {
        setIsLoading(true)
        return run(cloudFunctionName.giftCards,
            {
                filter
            },
            (result: Pagination<GiftCardDTO>) => {
                return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
                    return GiftCard.getFromDTO(res)
                }))
            },
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoading(false))
    }

    async function fetchGiftCard(giftCardId: string) {
        setIsLoading(true)
        return run(cloudFunctionName.giftCardDetails,
            {
                gift_card_id: giftCardId
            },
            (result: GiftCardDTO) => GiftCard.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoading(false))
    }

    function getGiftCard(giftCardId: string) {
        fetchGiftCard(giftCardId).then(giftCard => {
            if (giftCard) setGiftCard(giftCard)
        })
    }

    return {
        giftCard,
        fetchGiftCards,
        getGiftCard,
        isLoading
    }
}

export default useGiftCard;