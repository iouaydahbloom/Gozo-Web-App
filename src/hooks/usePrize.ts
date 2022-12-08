import { useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { PrizeDTO } from "../dto/PrizeDTO";
import { WheelSegment } from "../models/wheelSegment";
import { Prize } from "../models/prize";

const usePrize = () => {
    const [isLoadingPrizes, setIsLoadingPrizes] = useState(false);
    const [isLoadingPrize, setIsLoadingPrize] = useState(false);
    const [prize, setPrize] = useState<Prize>()
    const { run } = useCloud();

    async function fetchPrizes(loyaltyCurrency: string) {
        if (!loyaltyCurrency) return;
        setIsLoadingPrizes(true);
        return run(cloudFunctionName.groupedPrize,
            { brand: loyaltyCurrency },
            (result: PrizeDTO[]) => WheelSegment.getFromDTO(result),
            true)
            .then(result => {
                return result.isSuccess ? result.data : null
            })
            .finally(() => setIsLoadingPrizes(false))
    }

    async function fetchPrize(prizeId: string) {
        if (!prizeId) return;
        setIsLoadingPrize(true);
        return run(cloudFunctionName.prize,
            { prize_id: prizeId },
            (result: PrizeDTO) => Prize.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setPrize(result.data)
            })
            .finally(() => setIsLoadingPrize(false))
    }


    return {
        fetchPrizes,
        fetchPrize,
        isLoadingPrizes,
        prize,
        isLoadingPrize
    }
}

export default usePrize;