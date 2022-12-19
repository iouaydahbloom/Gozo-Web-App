import { useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { GiftCard } from "../models/giftCard";
import { GiftCardDTO } from "../dto/giftCardDTO";
import { Filter } from "../models/data/filter";
import { Pagination } from "../models/data/pagination";
import useConfirmation from "./useConfirmation";

const useGiftCard = () => {
    const [giftCard, setGiftCard] = useState<GiftCard>()
    const [isLoading, setIsLoading] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const { run } = useCloud();
    const { confirm } = useConfirmation();

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

    async function buyGiftCard(
        giftCardId: string,
        amount: string,
        onSuccess: () => any,
        onError: (error: any) => any) {
        setIsBuying(true);
        const simulationResult = await simulateBuyGiftCard(giftCardId, amount);
        debugger
        // confirm({
        //     title: 'Buy',
        //     message: 'You are buying this gift card for 10$',
        //     onConfirmed: () =>
        //         executeBuyGiftCard(giftCardId, amount)
        //             .then(result => {
        //                 if (result.isSuccess) {
        //                     onSuccess();
        //                 } else {
        //                     onError(result.errors.error[0]);
        //                 }
        //             })
        //             .finally(() => setIsBuying(false))
        // })
    }

    async function simulateBuyGiftCard(giftCardId: string, amount: string) {
        return run(
            cloudFunctionName.simulateGiftCardExchange,
            { gift_card_id: giftCardId, amount: amount },
            (res) => res,
            true
        )
    }

    async function executeBuyGiftCard(giftCardId: string, amount: string) {
        return run(
            cloudFunctionName.executeGiftCardExchange,
            { gift_card_id: giftCardId, amount: amount },
            () => true,
            true
        )
    }

    return {
        giftCard,
        fetchGiftCards,
        getGiftCard,
        buyGiftCard,
        isLoading,
        isBuying
    }
}

export default useGiftCard;