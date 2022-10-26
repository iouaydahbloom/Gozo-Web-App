import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { PrizeDTO } from "../dto/PrizeDTO";
import { WheelSegment } from "../models/wheelSegment";

const usePrize = () => {
    const [ isLoadingPrizes, setIsLoadingPrizes ] = useState(false);
    const { run } = useCloud();

    async function fetchPrizes(loyaltyCurrency: string ) {
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


    return {
        fetchPrizes,
        isLoadingPrizes
    }
}

export default usePrize;