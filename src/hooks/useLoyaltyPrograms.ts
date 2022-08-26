import { useContext, useState } from "react";
import { LoyaltyProgramDTO, UserLoyaltyProgramDTO } from "../dto/loyaltyProgramDTO";
import { LoyaltyProgram, MyLoyaltyProgram, UserLoyaltyProgram } from "../models/loyaltyProgram";
import { Pagination } from "../models/data/pagination";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { currencySettingsContext } from "../providers/CurrencySettingsProvider/currencySettingsContext";
import useCloud from "./useCloud";
import { Filter } from "../models/data/filter";

const useLoyaltyPrograms = () => {
    const [loadingMyPrograms, setLoadingMyPrograms] = useState(false);
    const { gozoLoyalty } = useContext(currencySettingsContext);
    const { run } = useCloud();

    async function getAllAvailablePrograms(filter: Filter) {
        return run(
            cloudFunctionName.programs,
            filter,
            (result: Pagination<LoyaltyProgramDTO>) => {
                return new Pagination(result.count,
                    result.next,
                    result.previous,
                    result.results.map(result => {
                        return LoyaltyProgram.getFromDTO(result)
                    }));
            })
            .then(result => {
                return result.isSuccess ? result.data : null
            })
    }

    async function updatePrograms(programs: MyLoyaltyProgram[]) {
        debugger
        return run(cloudFunctionName.updateMyPrograms,
            { programs: programs.map(sp => sp.toDTO()) },
            () => true,
            true)
            .then(result => {
                return result.isSuccess
            })
    }

    async function getMyPrograms() {
        setLoadingMyPrograms(true);
        return run(cloudFunctionName.getMyPrograms,
            null,
            (result: string) => {
                const parsedResult: UserLoyaltyProgramDTO[] = JSON.parse(result);
                return parsedResult.map(data => UserLoyaltyProgram.getFromDTO(data))
            },
            true)
            .then(result => {
                return result.isSuccess ? result.data : []
            })
            .finally(() => setLoadingMyPrograms(false))
    }

    return {
        defaultProgram: gozoLoyalty,
        fetchMyLoyaltyPrograms: getMyPrograms,
        fetchAllPrograms: getAllAvailablePrograms,
        updatePrograms: updatePrograms,
        loadingMyLoyaltyPrograms: loadingMyPrograms
    }
}

export default useLoyaltyPrograms;