import React, {useCallback, useEffect, useState} from 'react'
import LoyaltyProgramManageItem from './LoyaltyProgramManageItem'
import {LoyaltyProgram, UserLoyaltyProgram} from '../../../../models/loyaltyProgram'
import useLoyaltyPrograms from '../../../../hooks/loyaltyProgram/useLoyaltyPrograms'
import PrimarySearch from '../../../../components/inputs/PrimarySearch/PrimarySearch'
import styles from './loyaltyProgramsManager.module.scss';
import {Filter} from '../../../../models/data/filter'
import PageLoader from '../../../../components/loaders/PageLoader/PageLoader'
import useServerPagination from "../../../../hooks/useServerPagination";

const LoyaltyProgramsManager: React.FC = () => {

    const [searchKey, setSearchKey] = useState<string>('');
    const {fetchAllPrograms, myPrograms, fetchMyLoyaltyPrograms} = useLoyaltyPrograms({});

    const {data: programs, fetchData, isLoading} = useServerPagination<LoyaltyProgram, Filter>({
        intialFilters: new Filter(1, 100),
        getData: fetchAllPrograms as any
    })

    function getMyProgram(programId?: string): UserLoyaltyProgram | null {
        return myPrograms.find(pf => pf.currency?.programId === programId) ?? null
    }

    const renderLoyaltyProgramItem = useCallback((lp: LoyaltyProgram, index: number) => {
        return <LoyaltyProgramManageItem
            item={lp}
            key={lp.partnerId}
            myProgram={getMyProgram(lp.partnerId)}/>
    }, [programs, myPrograms, searchKey])

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <div className={styles.filterContainer}>
                <PrimarySearch
                    value={searchKey}
                    placeholder="Search Partners"
                    onChange={setSearchKey}/>
            </div>
            {
                isLoading ?
                    <PageLoader/> :
                    programs
                        .filter(program => !searchKey ||
                            program.companyName.toLowerCase().includes(searchKey?.toLowerCase()) ||
                            program.loyaltyCurrency?.shortName?.toLowerCase().includes(searchKey?.toLowerCase()))
                        .map((lp, index) => renderLoyaltyProgramItem(lp, index))
            }
        </>
    )
}

export default LoyaltyProgramsManager;