import React, { useCallback, useEffect, useState } from 'react'
import LoyaltyProgramManageItem from './LoyaltyProgramManageItem'
import useServerPagination from '../../../../hooks/useServerPagination'
import { LoyaltyProgram, UserLoyaltyProgram } from '../../../../models/loyaltyProgram'
import useLoyaltyPrograms from '../../../../hooks/useLoyaltyPrograms'
import PrimarySearch from '../../../../components/inputs/PrimarySearch/PrimarySearch'
import styles from './loyaltyProgramsManager.module.scss';
import { ProgramFilter } from '../../../../models/data/filter'
import PageLoader from '../../../../components/loaders/PageLoader/PageLoader'

const LoyaltyProgramsManager: React.FC = () => {

    const [isLoadingMyPrograms, setIsLoadingMyPrograms] = useState(false);
    const [myPrograms, setMyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const { fetchAllPrograms, fetchMyLoyaltyPrograms } = useLoyaltyPrograms();

    const { data: programs, isLoading } = useServerPagination<LoyaltyProgram, ProgramFilter>({
        getData: fetchAllPrograms as any
    })

    function getMyProgram(programId?: string): UserLoyaltyProgram | null {
        return myPrograms.find(pf => pf.currency?.programId == programId) ?? null
    }

    const renderLoyaltyProgramItem = useCallback((lp: LoyaltyProgram, index: number) => {
        return <LoyaltyProgramManageItem
            item={lp}
            key={index}
            fetchMyPrograms={() => getMyLoyaltyProgram()}
            myProgram={getMyProgram(lp.partnerId)} />
    }, [programs, myPrograms, searchKey])

    function getMyLoyaltyProgram() {
        fetchMyLoyaltyPrograms()
        .then(result => {
            if (result) {
                setMyPrograms(result);
            }
        })
        .finally(() => setIsLoadingMyPrograms(false))
    }
    useEffect(() => {
        setIsLoadingMyPrograms(true)
        getMyLoyaltyProgram()
    }, [])

    return (
        <>
            <div className={styles.filterContainer}>
                <PrimarySearch
                    value={searchKey}
                    placeholder="Search Partners"
                    onChange={setSearchKey} />
            </div>
            {
                isLoading || isLoadingMyPrograms ?
                    <PageLoader /> :
                    programs
                        .filter(prog => !searchKey ||
                            prog.companyName.toLowerCase().includes(searchKey?.toLowerCase()) ||
                            prog.loyaltyCurrency?.shortName?.toLowerCase().includes(searchKey?.toLowerCase()))
                        .map((lp, index) => renderLoyaltyProgramItem(lp, index))
            }
        </>
    )
}

export default LoyaltyProgramsManager;