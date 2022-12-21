import PrimaryGrid from '../../components/grids/PrimaryGrid/PrimaryGrid';
import { formatDate } from '../../helpers/dateManagment';
import { useHistory, useLocation, useParams } from 'react-router';
import { AppRoutes } from '../../constants/appRoutes';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { LoyaltyMemberHistory } from '../../models/loyaltyMember';
import SectionPlaceholder from '../../components/sections/SectionPlaceholder/SectionPlaceholder';
import useServerPagination from '../../hooks/useServerPagination';
import useProgramsTransactionHistory from '../../hooks/useProgramsTransactionHistory';
import { IonPage, useIonViewWillEnter } from '@ionic/react';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import { Virtuoso } from 'react-virtuoso';
import { InfiniteScrollPagination } from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import { useCallback } from 'react';

const LoyaltyPogramHistoryData: React.FC = () => {

    const { loyaltyCurrency } = useParams<{ loyaltyCurrency: string }>();
    const { push } = useHistory();
    const { state } = useLocation();
    const { getTransactions } = useProgramsTransactionHistory();
    const {
        data: historyFields,
        isLoading,
        hasMore: hasMoreLoyaltyHistoryFields,
        loadMore: loadMoreLoyaltyHistoryFields,
        fetchData: fetchLoyaltyHistoryFieldsData
    } = useServerPagination<LoyaltyMemberHistory, any>({
        getData: (filter) => getTransactions(filter, loyaltyCurrency)
    });

    const routingState = state as { loyaltyProgramName: string };

    const Placeholder = () => {
        return (
            <SectionPlaceholder
                description='You have no past transaction details here yet'
                logoUrl='assets/image/no-transactions.svg'
            />
        )
    }

    const loadMoreTransactions = (ev: any) => {
        setTimeout(() => {
            ev.target.complete();
            loadMoreLoyaltyHistoryFields();
        }, 1000);
    }

    const isScrollDisabled = useCallback(() => {
        return (!hasMoreLoyaltyHistoryFields)
    }, [hasMoreLoyaltyHistoryFields])

    useIonViewWillEnter(() => {
        fetchLoyaltyHistoryFieldsData();
    }, [loyaltyCurrency])

    return (
        <IonPage>
            <SecondaryHeader
                title={routingState?.loyaltyProgramName} />
            <PrimaryContainer
                scrollYAxis={false}
                isRefreshable
                onRefresh={fetchLoyaltyHistoryFieldsData}>
                <Virtuoso
                    className="ion-content-scroll-host"
                    style={{ height: "83vh", }}
                    totalCount={1}
                    itemContent={() => {
                        return (
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
                                        onClick: () => push(AppRoutes.getLoyaltyProgramTransactionHistoryDetailsRoute(loyaltyCurrency, hf.id))
                                    }
                                ))}
                                isLoading={isLoading}
                                placeholder={<Placeholder />}
                            />
                        )
                    }}
                    components={{
                        Footer: () => InfiniteScrollPagination(loadMoreTransactions, isScrollDisabled())
                    }}>
                </Virtuoso>
            </PrimaryContainer>
        </IonPage>
    )
}

export default LoyaltyPogramHistoryData;