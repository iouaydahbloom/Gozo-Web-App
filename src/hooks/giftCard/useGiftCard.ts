import {useState} from "react";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import useCloud from "../useCloud";
import {GiftCard} from "../../models/giftCard";
import {GiftCardDTO} from "../../dto/giftCardDTO";
import {Filter} from "../../models/data/filter";
import {Pagination} from "../../models/data/pagination";
import useConfirmation from "../useConfirmation";
import useLoyaltyPrograms from "../loyaltyProgram/useLoyaltyPrograms";
import useDataQuery from "../queryCaching/useDataQuery";
import {giftCardQueriesIdentity} from "./giftCardQueriesIdentity";
import useDataMutation from "../queryCaching/useDataMutation";
import {membershipQueriesIdentity} from "../membership/membershipQueriesIdentity";
import useCurrencyConversion from "../currencyConversion/useCurrencyConversion";

interface Props {
    giftCardId?: string
}

const useGiftCard = ({ giftCardId}: Props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const {run} = useCloud();
    const {confirm} = useConfirmation();
    const {defaultProgram} = useLoyaltyPrograms({});

    const giftCardQuery = useDataQuery({
        identity: giftCardQueriesIdentity.info(giftCardId!),
        fn: () => fetchGiftCard(giftCardId!),
        enabled: !!giftCardId
    })

    const {fiatToDefaultCurrencyResult} = useCurrencyConversion({fiat: giftCardQuery.data?.currency ?? '', amount: '1'})

    const buyGiftCardMutation = useDataMutation({
        mutatedIdentity: membershipQueriesIdentity.info(defaultProgram?.currency.loyaltyCurrency),
        fn: (args: {giftCardId: string, amount: string}) => executeBuyGiftCard(args.giftCardId, args.amount)
    })

    async function fetchGiftCards(filter: Filter) {
        setIsLoading(true)
        return run(cloudFunctionName.giftCards,
            filter,
            (result: Pagination<GiftCardDTO>) => {
                return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
                    return GiftCard.getFromDTO(res)
                }))
            },
            true)
            .then(result => {
                return result.isSuccess ? result.data : null;
            })
        .finally(() => setIsLoading(false))
    }

    async function fetchGiftCard(giftCardId: string) {
        return run(cloudFunctionName.giftCardDetails,
            {
                gift_card_id: giftCardId
            },
            (result: GiftCardDTO) => GiftCard.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
    }

    async function buyGiftCard(
        giftCardId: string,
        giftCardCurrency: string,
        amount: string,
        onSuccess: () => any,
        onError: (error: any) => any
    ) {
        setIsBuying(true);
        const pointsPerFiat = Math.round(fiatToDefaultCurrencyResult!.loyaltyAmount * parseFloat(amount));
        return confirm({
            title: 'Buy',
            message: `${pointsPerFiat} Super Points will be redeemed from you account, 
            are you sure you want to continue ?`,
            onConfirmed: () =>
                buyGiftCardMutation.mutateAsync({giftCardId, amount})
                    .then(result => {
                        if (result.isSuccess) {
                            onSuccess();
                        } else {
                            onError(result.message ? result.message : result.errors.errors[0].message);
                        }
                    })
                    .finally(() => setIsBuying(false)),
            onDeclined: () => setIsBuying(false)
        })
    }

    async function executeBuyGiftCard(giftCardId: string, amount: string) {
        return run(
            cloudFunctionName.executeGiftCardExchange,
            {gift_card_id: giftCardId, amount: amount},
            () => true,
            true
        )
    }

    return {
        giftCard: giftCardQuery.data,
        fetchGiftCards: fetchGiftCards,
        getGiftCard: giftCardQuery.refetch,
        buyGiftCard,
        fiatToPointsRate: fiatToDefaultCurrencyResult?.loyaltyAmount,
        isLoading: giftCardQuery.isLoading || isLoading,
        isBuying
    }
}

export default useGiftCard;