import { useContext, useEffect, useState } from 'react';
import { currencySettingsContext } from '../../../providers/CurrencySettingsProvider/currencySettingsContext'
import useCloud from '../../../hooks/useCloud'
import { cloudFunctionName } from '../../../moralis/cloudFunctionName'
import { LoyaltyMemberHistory } from '../../../models/loyaltyMember'
import { LoyaltyMemberHistoryDTO } from '../../../dto/loyaltyMemberDTO'
import { Pagination } from '../../../models/data/pagination';
import styles from './loyaltyProgramsHistory.module.scss';
import PrimaryGrid from '../../../components/grids/PrimaryGrid/PrimaryGrid';
import { stringToDate } from '../../../helpers/dateManagment';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';

const LoyaltyPogramsHistory = () => {

    const { push } = useHistory();
    const { gozoLoyalty } = useContext(currencySettingsContext);
    const [historyFields, setHistoryFields] = useState<LoyaltyMemberHistory[]>([]);
    const { run } = useCloud();

    function getTransactions() {
        run(cloudFunctionName.transactionHistory,
            { ca_loyalty_currency: gozoLoyalty?.currency.loyaltyCurrency },
            (result: Pagination<LoyaltyMemberHistoryDTO>) => {
                return new Pagination(result.count, result.next, result.previous, result.results.map(res => {
                    return LoyaltyMemberHistory.getFromDTO(res)
                }));
            },
            true)
            .then(result => {
                if (result.isSuccess) setHistoryFields(result.data.results);
            })
    }

    useEffect(() => {
        if (gozoLoyalty) getTransactions()
    }, [gozoLoyalty])

    return (
        <div className={styles.container}>
            <PrimaryGrid
                headers={['Date', 'Reason', 'Amount']}
                data={historyFields.map(hf => (
                    {
                        date: stringToDate(hf.completed_at ?? ''),
                        reason: hf.reason,
                        amount: hf.amount,
                        onClick: () => push({ pathname: AppRoutes.loyaltyProgramHistoryDetails, search: `?transaction_id=${hf.id}` })
                    }
                ))}
            />
        </div>
    )
}

export default LoyaltyPogramsHistory;