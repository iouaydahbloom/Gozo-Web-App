import { cloudFunctionName } from "../../constants/cloudFunctionName";
import useCloud from "../useCloud";
import { PrizeDTO } from "../../dto/PrizeDTO";
import { Prize } from "../../models/prize";
import { ReservedPrizesDTO } from "../../dto/reservedPrizesDTO";
import { ReservedPrizes } from "../../models/reservedPrizes";
import useDataQuery from "../queryCaching/useDataQuery";
import { prizeQueriesIdentity } from "./prizeQueriesIdentity";
import { useMemo, useState } from "react";

interface Props {
    loyaltyCurrency?: string,
    prizeId?: string
}

const useGamePrizes = ({ loyaltyCurrency, prizeId }: Props) => {

    const { run } = useCloud();
    const [prizesExpired, setPrizesExpired] = useState(false);
    const [gameToken, setGameToken] = useState('');

    const prizesQuery = useDataQuery({
        identity: prizeQueriesIdentity.loyaltyCurrency(loyaltyCurrency),
        fn: () => fetchPrizes(loyaltyCurrency)
    });

    const prizeQuery = useDataQuery({
        identity: prizeQueriesIdentity.info(prizeId),
        fn: () => fetchPrize(prizeId)
    });

    async function fetchPrizes(loyaltyCurrency?: string) {
        if (!loyaltyCurrency) return;
        return run(cloudFunctionName.groupedPrize,
            {
                brand: loyaltyCurrency,
                reserve_prizes: true
            },
            (result: ReservedPrizesDTO) => ReservedPrizes.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) {
                    if (!result.data.numberOfPrizes) {
                        setPrizesExpired(false);
                        setTimeout(() => setPrizesExpired(true), 180000);
                    }
                    if(result.data?.gameToken) {
                        setGameToken(result.data.gameToken)
                    }
                    return result.data
                } else {
                    return null
                }

            })
    }

    async function unReservePrizes() {
        if (!gameToken) return;
        return run(cloudFunctionName.unreservePrizes,
            { game_token: gameToken },
            (result: any) => result,
            true)
    }

    async function fetchPrize(prizeId?: string) {
        if (!prizeId) return;
        return run(cloudFunctionName.prize,
            { prize_id: prizeId },
            (result: PrizeDTO) => Prize.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data;
            })
    }

    const getUncollectedPrizes = useMemo(() => {
        if (prizesQuery.data?.numberOfPrizes && prizesQuery.data?.numberOfCollectedPrizes) {
            return prizesQuery.data.numberOfPrizes - prizesQuery.data.numberOfCollectedPrizes
        }
        return 0
    }, [prizesQuery.data?.numberOfPrizes, prizesQuery.data?.numberOfCollectedPrizes])

    return {
        fetchPrizes: prizesQuery.refetch,
        fetchPrize: prizeQuery.refetch,
        unReservePrizes: unReservePrizes,
        isLoadingPrizes: prizesQuery.isLoading,
        prize: prizeQuery.data,
        prizesExpired,
        gameToken,
        numberOfPrizes : prizesQuery.data?.numberOfPrizes,
        uncollectedPrizes: getUncollectedPrizes,
        collectedPrizes: prizesQuery.data?.numberOfCollectedPrizes,
        prizes: prizesQuery.data?.prizes,
        isLoadingPrize: prizeQuery.isLoading
    }
}

export default useGamePrizes;