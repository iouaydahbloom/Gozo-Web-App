import styles from './loyaltyProgramsHistory.module.scss';
import PrimaryGrid from '../../../components/grids/PrimaryGrid/PrimaryGrid';
import { formatDate } from '../../../helpers/dateManagment';
import { useHistory } from 'react-router';
import { AppRoutes } from '../../../constants/appRoutes';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { LoyaltyMemberHistory } from '../../../models/loyaltyMember';
import SectionPlaceholder from '../../../components/sections/SectionPlaceholder/SectionPlaceholder';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';

interface Props {
    isLoading: boolean,
    historyFields: LoyaltyMemberHistory[]
}

const LoyaltyPogramsHistory: React.FC<Props> = ({ isLoading, historyFields }) => {
    const { push } = useHistory();

    const Placeholder = () => {
        return (
            <SectionPlaceholder
                description='You have no past transaction details here yet'
                logoUrl='assets/image/no-transactions.svg'
                renderActions={() => <PrimaryButton onClick={() => push(AppRoutes.spinner)}>play now</PrimaryButton>}
            />
        )
    }

    return (
        <div className={styles.container}>
            <PrimaryGrid
                headers={['Date', 'Reason', 'Amount']}
                data={historyFields.map(hf => (
                    {
                        date: formatDate(hf.completed_at ?? ''),
                        reason: hf.reason,
                        amount: LoyaltyMemberHistory.isBalanceSubtracted(hf) ?
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
                isLoading={isLoading}
                placeholder={<Placeholder/>}
            />
        </div>
    )
}

export default LoyaltyPogramsHistory;