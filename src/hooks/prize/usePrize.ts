import {useState} from "react";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import useCloud from "../useCloud";
import {PrizeDTO} from "../../dto/PrizeDTO";
import {Prize} from "../../models/prize";
import {ReservedPrizesDTO} from "../../dto/reservedPrizesDTO";
import {ReservedPrizes} from "../../models/reservedPrizes";
import useDataQuery from "../queries/settings/useDataQuery";
import {prizeQueriesIdentity} from "./prizeQueriesIdentity";
import useDataMutation from "../queries/settings/useDataMutation";

interface Props {
    loyaltyCurrency?: string,
    prizeId?: string
}

const usePrize = ({loyaltyCurrency, prizeId}: Props) => {

    //const [isLoadingPrizes, setIsLoadingPrizes] = useState(false);
    //const [isLoadingPrize, setIsLoadingPrize] = useState(false);
    //const [prize, setPrize] = useState<Prize>()

    const {run} = useCloud();

    const prizesQuery = useDataQuery({
        identity: prizeQueriesIdentity.loyaltyCurrency(loyaltyCurrency),
        fn: () => fetchPrizes(loyaltyCurrency)
    });

    const prizeQuery = useDataQuery({
        identity: prizeQueriesIdentity.info(prizeId),
        fn: () => fetchPrize(prizeId)
    })

    const unreservedPrizeMutation = useDataMutation({
        mutatedIdentity: prizeQueriesIdentity.info(loyaltyCurrency),
        fn: unReservePrizes
    });

    async function fetchPrizes(loyaltyCurrency?: string) {
        if (!loyaltyCurrency) return;
        //setIsLoadingPrizes(true);
        return run(cloudFunctionName.groupedPrize,
            {
                brand: loyaltyCurrency,
                reserve_prizes: true
            },
            (result: ReservedPrizesDTO) => ReservedPrizes.getFromDTO(result),
            true)
            .then(result => {
                return result.isSuccess ? result.data : null
            })
        //.finally(() => setIsLoadingPrizes(false))
    }

    async function unReservePrizes(gameToken: string) {
        if (!gameToken) return;
        return run(cloudFunctionName.unreservePrizes,
            {game_token: gameToken},
            (result: any) => result,
            true)
    }

    async function fetchPrize(prizeId?: string) {
        if (!prizeId) return;
        //setIsLoadingPrize(true);
        return run(cloudFunctionName.prize,
            {prize_id: prizeId},
            (result: PrizeDTO) => Prize.getFromDTO(result),
            true)
            .then(result => {
                //if (result.isSuccess) setPrize(result.data)
                if (result.isSuccess) return result.data;
            })
        // .finally(() => setIsLoadingPrize(false))
    }

    return {
        fetchPrizes: prizesQuery.refetch,
        fetchPrize: prizeQuery.refetch,
        unReservePrizes: unreservedPrizeMutation.mutateAsync,
        isLoadingPrizes: prizesQuery.isLoading,
        prize: prizeQuery.data,
        prizes: prizesQuery.data,
        isLoadingPrize: prizeQuery.isLoading
    }
}

export default usePrize;