import {useState} from "react";
import {
    LoyaltyCurrency,
    LoyaltyProgram,
    UserLoyaltyProgram,
    UserLoyaltyProgramCurrency
} from "../../models/loyaltyProgram";
import {Pagination} from "../../models/data/pagination";
import {ProgramFilter} from "../../models/data/filter";
import {PartnershipType} from "../../types/exchangeType";
import {Redemption} from "../../models/redemption";
import {DynamicInputIdentifier} from "../../models/dynamicInputIdentifier";
import {act} from "@testing-library/react";

const useLoyaltyPrograms = () => {

    const [loadingMyPrograms, setLoadingMyPrograms] = useState(false);
    const [loadingProgram, setLoadingProgram] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const gozoLoyalty = new UserLoyaltyProgram(
        new UserLoyaltyProgramCurrency(
            'GZL',
            'Super Points',
            'GOZO',
            new Date(),
            '1',
            '1',
            'logo',
            false,
            false,
            false,
            false
        ),
        '1',
        [],
        new Date(),
        '1',
        '1',
        new Redemption(600, false)
    )

    const myMockedPrograms: UserLoyaltyProgram[] = [
        new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(
                'GZL2',
                'Super Points 2',
                'GOZO 2',
                new Date(),
                '2',
                '2',
                'logo',
                true,
                false,
                false,
                false
            ),
            '',
            [new DynamicInputIdentifier(new Date(), 1, 'key1', '123')],
            new Date(),
            '2',
            '2',
            null
        ),
        new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(
                'GZL3',
                'Super Points 3',
                'GOZO 3',
                new Date(),
                '3',
                '3',
                'logo',
                true,
                false,
                false,
                false
            ),
            '3',
            [new DynamicInputIdentifier(new Date(), 1, 'key1', '123')],
            new Date(),
            '3',
            '3',
            null
        ),
        new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(
                'GZL4',
                'Super Points 4',
                'GOZO 4',
                new Date(),
                '4',
                '4',
                'logo',
                false,
                false,
                false,
                false
            ),
            '4',
            [new DynamicInputIdentifier(new Date(), 1, 'key1', '123')],
            new Date(),
            '4',
            '4',
            null
        ),
        new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(
                'GZL5',
                'Super Points 5',
                'GOZO 5',
                new Date(),
                '5',
                '5',
                'logo',
                false,
                true,
                true,
                false
            ),
            '5',
            [new DynamicInputIdentifier(new Date(), 1, 'key1', '123')],
            new Date(),
            '5',
            '5',
            new Redemption(100, false)
        )
    ]

    async function fetchDefaultCurrency() {
        return Promise.resolve(gozoLoyalty);
    }

    async function getAllAvailablePrograms(filter: ProgramFilter) {
        return Promise.resolve(new Pagination(0,
            '',
            '',
            []))
    }

    async function getFilteredProgram(programId: string, exchangeType: PartnershipType) {
        const filterdProgram = new LoyaltyProgram(
            'GOZO',
            'logo',
            new LoyaltyCurrency('GZL', 'Super Points'),
            programId,
            null,
            null,
            null,
            ''
        );
        return Promise.resolve(filterdProgram);
    }

    async function getProgram(programId: string) {
        const loyaltyProgram = new LoyaltyProgram('Gozo',
            'logo',
            new LoyaltyCurrency('id', 'Super Points'),
            programId,
            null,
            null,
            null,
            ''
        );
        setLoadingProgram(true)
        return Promise.resolve(loyaltyProgram)
            .finally(() => setLoadingProgram(false))
    }

    async function getMyPrograms() {
        act(() => setLoadingMyPrograms(true));
        return Promise.resolve(myMockedPrograms)
            .finally(() => {
                act(() => setLoadingMyPrograms(false))
            })
    }

    async function connectProgram(program: UserLoyaltyProgram) {
        setIsUpdating(true);
        return Promise.resolve(true)
            .finally(() => setIsUpdating(false))
    }

    async function disconnectProgram(userCurrencyId: string) {
        setIsUpdating(true);
        return Promise.resolve(true)
            .finally(() => setIsUpdating(false))
    }

    async function disconnectPrograms(userCurrencyIds: string[]) {
        setIsUpdating(true);
        return Promise.resolve(true)
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