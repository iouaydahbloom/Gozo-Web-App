import {useContext, useMemo} from "react";
import {LoyaltyProgramDTO, UserLoyaltyProgramDTO} from "../../dto/loyaltyProgramDTO";
import {LoyaltyProgram, UserLoyaltyProgram} from "../../models/loyaltyProgram";
import {Pagination} from "../../models/data/pagination";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {currencySettingsContext} from "../../providers/CurrencySettingsProvider/currencySettingsContext";
import useCloud from "../useCloud";
import {Filter} from "../../models/data/filter";
import {PartnershipType} from "../../types/exchangeType";
import useDataQuery from "../queryCaching/useDataQuery";
import useDataMutation from "../queryCaching/useDataMutation";
import {loyaltyProgramQueriesIdentity} from "./loyaltyProgramQueriesIdentity";

interface Props {
    programFilter?: { programId: string, exchangeType: PartnershipType },
    programId?: string
}

const useLoyaltyPrograms = ({programFilter, programId}: Props) => {

    const {gozoLoyalty} = useContext(currencySettingsContext);
    const {run} = useCloud();

    const programQuery = useDataQuery({
        identity: loyaltyProgramQueriesIdentity.program(programId),
        fn: () => getProgram(programId!)
    })

    const filteredProgramQuery = useDataQuery({
        identity: loyaltyProgramQueriesIdentity.filteredProgram(programFilter?.programId!, programFilter?.exchangeType!),
        fn: () => getFilteredProgram(programFilter?.programId!, programFilter?.exchangeType!),
        enabled: !!programFilter?.programId && !!programFilter.exchangeType
    })

    const userProgramsQuery = useDataQuery({
        identity: loyaltyProgramQueriesIdentity.userPrograms,
        fn: getMyPrograms
    })

    const connectProgramMutation = useDataMutation({
        mutatedIdentity: loyaltyProgramQueriesIdentity.userPrograms,
        fn: connectProgram
    })

    const disconnectProgramMutation = useDataMutation({
        mutatedIdentity: loyaltyProgramQueriesIdentity.userPrograms,
        fn: disconnectProgram
    })

    const disconnectProgramsMutation = useDataMutation({
        mutatedIdentity: loyaltyProgramQueriesIdentity.userPrograms,
        fn: disconnectPrograms
    })

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
            {page: 1, page_size: 10, partnerId: programId, exchangeType: exchangeType},
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
            programId ? {partner_id: programId} : {},
            (result: LoyaltyProgramDTO) => LoyaltyProgram.getFromDTO(result))
            .then(result => {
                return result.isSuccess ? result.data : null
            })
    }

    async function getMyPrograms() {
        return run(cloudFunctionName.getMyPrograms,
            null,
            (result: UserLoyaltyProgramDTO[]) => result.map(data => UserLoyaltyProgram.getFromDTO(data)),
            true)
            .then(result => result.isSuccess ? result.data : [])
    }

    async function connectProgram(program: UserLoyaltyProgram) {
        return run(cloudFunctionName.connectProgram,
            {program: program.toMyLoyaltyProgramDTO()},
            (result: UserLoyaltyProgramDTO) => UserLoyaltyProgram.getFromDTO(result),
            true)
            .then(result => {
                if (!result.isSuccess) {
                    throw new Error(result.errors.detail);
                }

                return result.data
            })
    }

    async function disconnectProgram(userCurrencyId: string) {
        return run(cloudFunctionName.disconnectProgram,
            {userCurrencyId: userCurrencyId},
            () => true,
            true)
            .then(result => result.isSuccess)
    }

    async function disconnectPrograms(userCurrencyIds: string[]) {
        return run(cloudFunctionName.disconnectPrograms,
            {userCurrencyIds: userCurrencyIds},
            () => true,
            true)
            .then(result => result.isSuccess)
    }

    return {
        defaultProgram: gozoLoyalty,
        fetchMyLoyaltyPrograms: userProgramsQuery.refetch,
        fetchAllPrograms: getAllAvailablePrograms,
        fetchFilteredProgram: filteredProgramQuery.refetch,
        filteredProgram: filteredProgramQuery.data,
        fetchProgram: programQuery.refetch,
        loadingMyLoyaltyPrograms: userProgramsQuery.isLoading,
        loadingProgram: programQuery.isLoading,
        connectProgram: connectProgramMutation.mutateAsync,
        disconnectProgram: disconnectProgramMutation.mutateAsync,
        disconnectPrograms: disconnectProgramsMutation.mutateAsync,
        isUpdating: connectProgramMutation.isLoading ||
            disconnectProgramMutation.isLoading ||
            disconnectProgramsMutation.isLoading,
        program: useMemo(() => programQuery.data, [programQuery.data]),
        myPrograms: useMemo(() => userProgramsQuery.data ?? [], [userProgramsQuery.data])
    }
}

export default useLoyaltyPrograms;