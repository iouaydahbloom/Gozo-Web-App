import React, { useCallback, useEffect, useState } from 'react'
import LoyaltyProgramManageItem from './LoyaltyProgramManageItem'
import useServerPagination from '../../../../hooks/useQueriedServerPagination'
import { LoyaltyProgram, UserLoyaltyProgram } from '../../../../models/loyaltyProgram'
import useLoyaltyPrograms from '../../../../hooks/useLoyaltyPrograms'
import PrimarySearch from '../../../../components/inputs/PrimarySearch/PrimarySearch'
import styles from './loyaltyProgramsManager.module.scss';
import { Filter } from '../../../../models/data/filter'
import PageLoader from '../../../../components/loaders/PageLoader/PageLoader'
import useUserProgramsQuery from '../../../../hooks/query/useUserProgramsQuery'

const LoyaltyProgramsManager: React.FC = () => {

    //const [isLoadingMyPrograms, setIsLoadingMyPrograms] = useState(false);
    //const [myPrograms, setMyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const { fetchAllPrograms } = useLoyaltyPrograms();
    const userProgramQuery = useUserProgramsQuery();
    const myPrograms = userProgramQuery.data ?? [];

    const { data: programs, isLoading } = useServerPagination<LoyaltyProgram, Filter>({
        id: 'programs',
        initialFilter: new Filter(1, 100),
        getData: fetchAllPrograms as any
    })

    function getMyProgram(programId?: string): UserLoyaltyProgram | null {
        return myPrograms.find(pf => pf.currency?.programId === programId) ?? null
    }

    const renderLoyaltyProgramItem = useCallback((lp: LoyaltyProgram, index: number) => {
        return <LoyaltyProgramManageItem
            item={lp}
            key={lp.partnerId}
            fetchMyPrograms={() => userProgramQuery.refetch()}
            myProgram={getMyProgram(lp.partnerId)} />
    }, [programs, myPrograms, searchKey])

    // function getMyLoyaltyProgram() {
    //     fetchMyLoyaltyPrograms()
    //         .then(result => {
    //             if (result) {
    //                 setMyPrograms(result);
    //             }
    //         })
    //         .finally(() => setIsLoadingMyPrograms(false))
    // }

    useEffect(() => {
        //fetchData()
        //setIsLoadingMyPrograms(true)
        //getMyLoyaltyProgram()

        return () => {
            //setIsLoadingMyPrograms(false)
        }
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
                //isLoading || isLoadingMyPrograms ?
                isLoading ?
                    <PageLoader /> :
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