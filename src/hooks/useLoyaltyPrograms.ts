import { useContext, useState } from "react";
import { LoyaltyProgramDTO, UserLoyaltyProgramDTO } from "../dto/loyaltyProgramDTO";
import { LoyaltyProgram, UserLoyaltyProgram } from "../models/loyaltyProgram";
import { Pagination } from "../models/data/pagination";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { currencySettingsContext } from "../providers/CurrencySettingsProvider/currencySettingsContext";
import useCloud from "./useCloud";
import { ProgramFilter } from "../models/data/filter";
import { PartnershipType } from "../types/exchangeType";

const useLoyaltyPrograms = () => {
    const [loadingMyPrograms, setLoadingMyPrograms] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { gozoLoyalty } = useContext(currencySettingsContext);
    const { run } = useCloud();

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
                return result.isSuccess ? result.data : null
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
                return result.isSuccess ? result.data : null
            })
    }

    async function getProgram(programId: string) {
        return run(
            cloudFunctionName.program,
            { partner_id: programId },
            (result: LoyaltyProgramDTO) => {
                const stringifiedResult = JSON.stringify(result);
                const parsedResult: LoyaltyProgramDTO = JSON.parse(stringifiedResult);
                return LoyaltyProgram.getFromDTO(parsedResult)
            })
            .then(result => {
                return result.isSuccess ? result.data : null
            })
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
                return result.isSuccess ? result.data : []
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
            .finally(() => setIsUpdating(false))
    }

    async function disconnectProgram(userCurrencyId: string) {
        setIsUpdating(true);
        return run(cloudFunctionName.disconnectProgram,
            { userCurrencyId: userCurrencyId },
            () => true,
            true)
            .then(result => {
                return result.isSuccess
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
                return result.isSuccess
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
        connectProgram,
        disconnectProgram,
        disconnectPrograms,
        isUpdating
    }
}

export default useLoyaltyPrograms;