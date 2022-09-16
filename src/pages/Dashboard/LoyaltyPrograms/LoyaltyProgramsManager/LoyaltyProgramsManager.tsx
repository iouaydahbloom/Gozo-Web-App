import React, { useCallback, useEffect, useState } from 'react'
import LoyaltyProgramManageItem from './LoyaltyProgramManageItem'
import useServerPagination from '../../../../hooks/useServerPagination'
import { LoyaltyProgram, UserLoyaltyProgram } from '../../../../models/loyaltyProgram'
import useLoyaltyPrograms from '../../../../hooks/useLoyaltyPrograms'
import PrimaryModal from '../../../../components/modals/PrimaryModal/PrimaryModal'
import PrimarySearch from '../../../../components/inputs/PrimarySearch/PrimarySearch'
import styles from './loyaltyProgramsManager.module.scss';
import { ProgramFilter } from '../../../../models/data/filter'

const LoyaltyProgramsManager: React.FC = () => {

    const [isLoading, setLoading] = useState(false);
    const [myPrograms, setMyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const { fetchAllPrograms, fetchMyLoyaltyPrograms } = useLoyaltyPrograms();

    const { data: programs } = useServerPagination<LoyaltyProgram, ProgramFilter>({
        getData: fetchAllPrograms as any
    })

    function getMyProgram(programId?: string): UserLoyaltyProgram | null {
        return myPrograms.find(pf => pf.currency?.programId == programId) ?? null
    }

    const renderLoyaltyProgramItem = useCallback((lp: LoyaltyProgram, index: number) => {
        return <LoyaltyProgramManageItem
            item={lp}
            key={index}
            myProgram={getMyProgram(lp.partnerId)} />
    }, [programs, myPrograms, searchKey])

    useEffect(() => {
        setLoading(true)
        fetchMyLoyaltyPrograms()
            .then(result => {
                if (result) {
                    setMyPrograms(result);
                }
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <PrimaryModal
            title='Partners'
            renderBody={() => (
                <div className={styles.container}>
                    <div className={styles.filterContainer}>
                        <PrimarySearch
                            value={searchKey}
                            onChange={setSearchKey} />
                    </div>
                    <div className={styles.programsContainer}>
                        {!isLoading &&
                            programs
                                .filter(prog => !searchKey ||
                                    prog.companyName.toLowerCase().includes(searchKey?.toLowerCase()) ||
                                    prog.loyaltyCurrency?.shortName?.toLowerCase().includes(searchKey?.toLowerCase()))
                                .map((lp, index) => renderLoyaltyProgramItem(lp, index))}
                    </div>
                </div>
            )}
        />
    )
}

export default LoyaltyProgramsManager;