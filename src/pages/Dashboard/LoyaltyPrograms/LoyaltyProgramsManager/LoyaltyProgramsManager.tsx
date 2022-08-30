import React, { useCallback, useEffect, useState } from 'react'
import LoyaltyProgramManageItem from './LoyaltyProgramManageItem'
import useServerPagination from '../../../../hooks/useServerPagination'
import { LoyaltyProgram, MyLoyaltyProgram } from '../../../../models/loyaltyProgram'
import useLoyaltyPrograms from '../../../../hooks/useLoyaltyPrograms'
import collectionManipulationHelper from '../../../../utils/collectionManipulationHelper'
import PrimaryModal from '../../../../components/modals/PrimaryModal/PrimaryModal'
import PrimarySearch from '../../../../components/inputs/PrimarySearch/PrimarySearch'
import styles from './loyaltyProgramsManager.module.scss';
import { IonContent } from '@ionic/react'

const LoyaltyProgramsManager: React.FC = () => {

    const [isLoading, setLoading] = useState(false);
    const [myPrograms, setMyPrograms] = useState<MyLoyaltyProgram[]>([]);
    const [selectedProgramIds, setSelectedProgramIds] = useState<string[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const { fetchAllPrograms, fetchMyLoyaltyPrograms, updatePrograms } = useLoyaltyPrograms();

    const { data: programs } = useServerPagination<LoyaltyProgram>({
        getData: fetchAllPrograms as any
    })

    function saveMyPrograms() {
        updatePrograms(getSelectedPrograms())
            .then(result => {
                if (result) {
                    alert('Programs Saved Successfuly');
                    // navigation.navigate(AppRoute.assets);
                }
            })
    }

    function getMyProgram(programId?: string): MyLoyaltyProgram | null {
        return myPrograms.find(pf => pf.programId == programId) ?? null
    }

    function getSelectedPrograms() {
        return myPrograms.filter(mp => selectedProgramIds.includes(mp.programId))
    }

    function isPreviouslySelected(programId: string) {
        return selectedProgramIds.includes(programId)
    }

    const handleMyProgramUpdate = useCallback((myProgram: MyLoyaltyProgram) => {
        if (!getMyProgram(myProgram.programId)) {
            setMyPrograms([...myPrograms, myProgram])
        }
        else {
            getMyProgram(myProgram.programId)!.membership = myProgram.membership;
            setMyPrograms([...myPrograms])
        }
    }, [myPrograms])

    const handleSelectionChange = useCallback((isItemSelected: boolean, programId: string) => {
        if (isItemSelected && !isPreviouslySelected(programId)) {
            setSelectedProgramIds([...selectedProgramIds, programId])
        }
        else if (!isItemSelected && isPreviouslySelected(programId)) {
            const index = selectedProgramIds.findIndex(spid => spid == programId);
            setSelectedProgramIds([...collectionManipulationHelper.removeAtIndex(selectedProgramIds, index)])
        }
    }, [selectedProgramIds, myPrograms])

    const renderLoyaltyProgramItem = useCallback((lp: LoyaltyProgram, index: number) => {
        return <LoyaltyProgramManageItem
            item={lp}
            key={index}
            myProgram={getMyProgram(lp.partnerId)}
            onMyProgramChange={handleMyProgramUpdate}
            onSelectionChange={(isSelected) => handleSelectionChange(isSelected, lp.partnerId)} />
    }, [programs, myPrograms, selectedProgramIds, searchKey])

    useEffect(() => {
        setLoading(true)
        fetchMyLoyaltyPrograms()
            .then(result => {
                if (result) {
                    const myPrograms = result.map((userProg: any) => {
                        return userProg.toMyLoyaltyProgram()
                    })
                    setMyPrograms(myPrograms);
                    setSelectedProgramIds(myPrograms.map(mp => mp.programId));
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