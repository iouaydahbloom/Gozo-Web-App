import { useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { GiftCard } from "../models/giftCard";
import { GiftCardDTO } from "../dto/giftCardDTO";
import { Filter } from "../models/data/filter";
import { Pagination } from "../models/data/pagination";
import useConfirmation from "./useConfirmation";
import useLoyaltyPrograms from "./useLoyaltyPrograms";
import { FiatToLoyaltyConversionDTO } from "../dto/fiatToLoyaltyConversionDTO";
import { FiatToLoyaltyConversion } from "../models/fiatToLoyaltyConversion";

const useGiftCard = () => {
    const [giftCard, setGiftCard] = useState<GiftCard>()
    const [isLoading, setIsLoading] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const { run } = useCloud();
    const { confirm } = useConfirmation();
    const { defaultProgram } = useLoyaltyPrograms();

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
        giftCardCurrency: string,
        amount: string,
        onSuccess: () => any,
        onError: (error: any) => any,
        pointsPerFiat?: number) {
        setIsBuying(true);
        if (!pointsPerFiat) {
            const simulationResult = await simulateFiatToPointsConversion(giftCardCurrency, amount);
            if (!simulationResult.isSuccess) {
                onError(simulationResult.message ?? simulationResult.errors.errors[0].message);
                setIsBuying(false);
                return;
            }

            pointsPerFiat = simulationResult.data.loyaltyAmount;
        } else {
            pointsPerFiat = pointsPerFiat * parseInt(amount);
        }

        confirm({
            title: 'Buy',
            message: `${pointsPerFiat} Super Points will be redeemed from you account, 
            are you sure you want to continue ?`,
            onConfirmed: () =>
                executeBuyGiftCard(giftCardId, amount)
                    .then(result => {
                        if (result.isSuccess) {
                            onSuccess();
                        } else {
                            onError(result.message ?? result.errors.errors[0].message);
                        }
                    })
                    .finally(() => setIsBuying(false)),
            onDeclined: () => setIsBuying(false)
        })
    }

    async function simulateFiatToPointsConversion(fiatCurrency: string, amount: string) {
        return run(
            cloudFunctionName.simulateFiatConversion,
            { amount: amount, loyalty_currency: defaultProgram?.currency.loyaltyCurrency, fiat_currency: fiatCurrency },
            (res: FiatToLoyaltyConversionDTO) => FiatToLoyaltyConversion.fromDTO(res),
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
        simulateFiatToPointsConversion,
        isLoading,
        isBuying
    }
}

export default useGiftCard;