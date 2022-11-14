import styles from './loyaltyProgramsHistory.module.scss';
import PrimaryGrid from '../../../components/grids/PrimaryGrid/PrimaryGrid';
import { formatDate } from '../../../helpers/dateManagment';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import useProgramsTransactionHistory from '../../../hooks/useProgramsTransactionHistory';
import PageLoader from '../../../components/loaders/PageLoader/PageLoader';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { useEffect } from 'react';

const LoyaltyPogramsHistory = () => {
    const { push } = useHistory();
    const { isLoadingHistory, historyFields, getTransactions } = useProgramsTransactionHistory()

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <div className={styles.container}>
            {!isLoadingHistory ?
                <PrimaryGrid
                    headers={['Date', 'Reason', 'Amount']}
                    data={historyFields.map(hf => (
                        {
                            date: formatDate(hf.completed_at ?? ''),
                            reason: hf.reason,
                            amount: hf.type === "redemption" ||
                                (hf.type === 'member_exchange' &&
                                    hf.sub_type === 'out') ?
                                <PrimaryTypography color='danger'>
                                    {`- ${hf.amount}`}
                                </PrimaryTypography>
                                :
                                <PrimaryTypography color='success'>
                                    {`+ ${hf.amount}`}
                                </PrimaryTypography>,
                            onClick: () => push({ pathname: AppRoutes.loyaltyProgramHistoryDetails, search: `?transaction_id=${hf.id}` })
                        }
                    ))}
                />
                :
                <PageLoader />}
        </div>
    )
}

export default LoyaltyPogramsHistory;