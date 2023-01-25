import React, {useCallback, useState} from 'react'
import LoyaltyProgramManageItem from './LoyaltyProgramManageItem'
import {LoyaltyProgram, UserLoyaltyProgram} from '../../../../models/loyaltyProgram'
import useLoyaltyPrograms from '../../../../hooks/loyaltyProgram/useLoyaltyPrograms'
import PrimarySearch from '../../../../components/inputs/PrimarySearch/PrimarySearch'
import styles from './loyaltyProgramsManager.module.scss';
import PageLoader from '../../../../components/loaders/PageLoader/PageLoader'
import usePaginatedQuery from '../../../../hooks/queryCaching/usePaginatedQuery'

const LoyaltyProgramsManager: React.FC = () => {

    const [searchKey, setSearchKey] = useState<string>('');
    const {fetchAllPrograms, myPrograms} = useLoyaltyPrograms({});

    const paginatedQuery = usePaginatedQuery({
        identity: ['loyaltyPrograms'],
        getData: fetchAllPrograms
    });

    function getMyProgram(programId?: string): UserLoyaltyProgram | null {
        return myPrograms.find(pf => pf.currency?.programId === programId) ?? null
    }

    const renderLoyaltyProgramItem = useCallback((lp: LoyaltyProgram, index: number) => {
        return <LoyaltyProgramManageItem
            item={lp}
            key={lp.partnerId}
            myProgram={getMyProgram(lp.partnerId)}/>
    }, [paginatedQuery.data, myPrograms, searchKey])

    return (
        <>
            <div className={styles.filterContainer}>
                <PrimarySearch
                    value={searchKey}
                    placeholder="Search Partners"
                    onChange={setSearchKey}/>
            </div>
            {
                paginatedQuery.isLoading ?
                    <PageLoader/> :
                    paginatedQuery.data?.filter((program: any) => !searchKey ||
                            program.companyName.toLowerCase().includes(searchKey?.toLowerCase()) ||
                            program.loyaltyCurrency?.shortName?.toLowerCase().includes(searchKey?.toLowerCase()))
                        .map((lp: any, index) => renderLoyaltyProgramItem(lp, index))
            }
        </>
    )
}

export default LoyaltyProgramsManager;