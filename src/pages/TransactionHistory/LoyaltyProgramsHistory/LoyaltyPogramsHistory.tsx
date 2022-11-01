import styles from './loyaltyProgramsHistory.module.scss';
import PrimaryGrid from '../../../components/grids/PrimaryGrid/PrimaryGrid';
import { formatDate } from '../../../helpers/dateManagment';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import useProgramsTransactionHistory from '../../../hooks/useProgramsTransactionHistory';
import PageLoader from '../../../components/loaders/PageLoader/PageLoader';

const LoyaltyPogramsHistory = () => {
    const { push } = useHistory();
    const { isLoadingHistory, historyFields } = useProgramsTransactionHistory()

    return (
        <div className={styles.container}>
            {!isLoadingHistory ?
                <PrimaryGrid
                    headers={['Date', 'Reason', 'Amount']}
                    data={historyFields.map(hf => (
                        {
                            date: formatDate(hf.completed_at ?? ''),
                            reason: hf.reason,
                            amount: hf.amount,
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