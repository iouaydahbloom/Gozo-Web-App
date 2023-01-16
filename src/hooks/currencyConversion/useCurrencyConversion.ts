import useDataQuery from "../queries/settings/useDataQuery";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {FiatToLoyaltyConversionDTO} from "../../dto/fiatToLoyaltyConversionDTO";
import {FiatToLoyaltyConversion} from "../../models/fiatToLoyaltyConversion";
import useCloud from "../useCloud";
import useLoyaltyPrograms from "../loyaltyProgram/useLoyaltyPrograms";
import {currencyConversionQueriesIdentity} from "./currencyConversionQueriesIdentity";

interface Props {
    fiat: string,
    amount: string
}

const useCurrencyConversion = ({fiat , amount}: Props) => {

    const{run}=useCloud();
    const{defaultProgram}=useLoyaltyPrograms({});

    const fiatToPointsQuery = useDataQuery({
        identity: currencyConversionQueriesIdentity.simulateFiatToDefaultPointsConversion(fiat, amount),
        fn: () => simulateFiatToDefaultCurrencyConversion(fiat, amount)
    })

    async function simulateFiatToDefaultCurrencyConversion(fiatCurrency: string, amount: string) {
        return run(
            cloudFunctionName.simulateFiatConversion,
            {amount: amount, loyalty_currency: defaultProgram?.currency.loyaltyCurrency, fiat_currency: fiatCurrency},
            (res: FiatToLoyaltyConversionDTO) => FiatToLoyaltyConversion.fromDTO(res),
            true
        )
            .then(result => {
                return result.isSuccess ? result.data: null;
            })
    }

    return {
        fiatToDefaultCurrencyResult: fiatToPointsQuery.data
    }

}

export default useCurrencyConversion;