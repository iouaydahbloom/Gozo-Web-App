import { useState } from "react";
import { DefaultCurrencyDTO } from "../dto/defaultCurrencyDTO";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";

const useDefaultCurrency = () => {
    const [ isLoading, setIsLoading ] = useState(false);
    const { run } = useCloud();

    async function fetchDefaultCurrency() {
        setIsLoading(true);
        return run(cloudFunctionName.defaultCurrency,
            {},
            (result: DefaultCurrencyDTO) => UserLoyaltyProgram.getFromDefaultCurrencyDTO(result),
            true)
            .then(result => {
                return result.isSuccess ? result.data : null
            })
            .finally(() => setIsLoading(false))
    }


    return {
        fetchDefaultCurrency,
        isLoading
    }
}

export default useDefaultCurrency;