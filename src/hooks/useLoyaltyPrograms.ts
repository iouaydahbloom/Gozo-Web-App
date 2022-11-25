import { useContext, useState } from "react";
import { LoyaltyProgramDTO, UserLoyaltyProgramDTO } from "../dto/loyaltyProgramDTO";
import { LoyaltyProgram, UserLoyaltyProgram } from "../models/loyaltyProgram";
import { Pagination } from "../models/data/pagination";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { currencySettingsContext } from "../providers/CurrencySettingsProvider/currencySettingsContext";
import useCloud from "./useCloud";
import { ProgramFilter } from "../models/data/filter";
import { PartnershipType } from "../types/exchangeType";
import { DefaultCurrencyDTO } from "../dto/defaultCurrencyDTO";

const useLoyaltyPrograms = () => {
    const [loadingMyPrograms, setLoadingMyPrograms] = useState(false);
    const [loadingProgram, setLoadingProgram] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { gozoLoyalty } = useContext(currencySettingsContext);
    const { run } = useCloud();

    async function fetchDefaultCurrency() {
        return run(cloudFunctionName.defaultCurrency,
            null,
            (result: DefaultCurrencyDTO) => UserLoyaltyProgram.getFromDefaultCurrencyDTO(result),
            true)
            .then(result => {
                if (!result.isSuccess) {
                    throw (new Error(result.message));
                }

                return result.data;
            })
    }

    async function getAllAvailablePrograms(filter: ProgramFilter) {
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
                if (!result.isSuccess) {
                    return new Pagination(0,
                        '',
                        '',
                        []);
                }

                return result.data;
            })
    }

    async function getFilteredProgram(programId: string, exchangeType: PartnershipType) {
        return run(
            cloudFunctionName.programs,
            { page: 1, page_size: 10, partnerId: programId, exchangeType: exchangeType },
            (result: Pagination<LoyaltyProgramDTO>) => {
                return result.results.length > 0 ? LoyaltyProgram.getFromDTO(result.results[0]) : null
            })
            .then(result => {
                if (!result.isSuccess) {
                    throw (new Error(result.message));
                }

                return result.data;
            })
    }

    async function getProgram(programId: string) {
        setLoadingProgram(true)
        return run(
            cloudFunctionName.program,
            programId ? { partner_id: programId } : {},
            (result: LoyaltyProgramDTO) => {
                return LoyaltyProgram.getFromDTO(result)
            })
            .then(result => {
                if (!result.isSuccess) {
                    throw (new Error(result.message));
                    return null;
                }

                return result.data;
            })
            .finally(() => setLoadingProgram(false))
    }

    async function getMyPrograms() {
        setLoadingMyPrograms(true);
        return run(cloudFunctionName.getMyPrograms,
            null,
            (result: UserLoyaltyProgramDTO[]) => {
                const stringifiedResult = JSON.stringify(result);
                const parsedResult: UserLoyaltyProgramDTO[] = JSON.parse(stringifiedResult);
                return parsedResult.map(data => UserLoyaltyProgram.getFromDTO(data))
            },
            true)
            .then(result => {
                if (!result.isSuccess) {
                    throw (new Error(result.message));
                }

                return result.data;
            })
            .finally(() => setLoadingMyPrograms(false))
    }

    async function connectProgram(program: UserLoyaltyProgram) {
        setIsUpdating(true);
        return run(cloudFunctionName.connectProgram,
            { program: program.toMyLoyaltyProgramDTO() },
            (result: any) => {
                const stringifiedResult = JSON.stringify(result);
                const parsedResult: UserLoyaltyProgramDTO = JSON.parse(stringifiedResult);
                return UserLoyaltyProgram.getFromDTO(parsedResult);
            },
            true)
            .then(result => {
                if (!result.isSuccess) throw (new Error(result.message));
                return result;
            })
            .finally(() => setIsUpdating(false))
    }

    async function disconnectProgram(userCurrencyId: string) {
        setIsUpdating(true);
        return run(cloudFunctionName.disconnectProgram,
            { userCurrencyId: userCurrencyId },
            () => true,
            true)
            .then(result => {
                if (!result.isSuccess) {
                    throw (new Error(result.message));
                }

                return true;
            })
            .finally(() => setIsUpdating(false))
    }

    async function disconnectPrograms(userCurrencyIds: string[]) {
        setIsUpdating(true);
        return run(cloudFunctionName.disconnectPrograms,
            { userCurrencyIds: userCurrencyIds },
            () => true,
            true)
            .then(result => {
                if (!result.isSuccess) {
                    throw (new Error(result.message));
                }

                return true;
            })
            .finally(() => setIsUpdating(false))
    }

    return {
        defaultProgram: gozoLoyalty,
        fetchMyLoyaltyPrograms: getMyPrograms,
        fetchAllPrograms: getAllAvailablePrograms,
        fetchFilteredProgram: getFilteredProgram,
        fetchProgram: getProgram,
        loadingMyLoyaltyPrograms: loadingMyPrograms,
        loadingProgram: loadingProgram,
        fetchDefaultCurrency,
        connectProgram,
        disconnectProgram,
        disconnectPrograms,
        isUpdating
    }
}

export default useLoyaltyPrograms;