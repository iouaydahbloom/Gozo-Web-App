import PrimaryGrid from '../../components/grids/PrimaryGrid/PrimaryGrid';
import { formatDate } from '../../helpers/dateManagment';
import { useHistory, useLocation, useParams } from 'react-router';
import { AppRoutes } from '../../constants/appRoutes';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { LoyaltyMemberHistory } from '../../models/loyaltyMember';
import SectionPlaceholder from '../../components/sections/SectionPlaceholder/SectionPlaceholder';
import useProgramsTransactionHistory from '../../hooks/programsTransactionHistory/useProgramsTransactionHistory';
import { IonPage } from '@ionic/react';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import SecondaryHeader from '../../components/headers/SecondaryHeader/SecondaryHeader';
import { Virtuoso } from 'react-virtuoso';
import { InfiniteScrollPagination } from '../../components/InfiniteScrollPagination/InfiniteScrollPagination';
import React, { useCallback } from "react";
import usePaginatedQuery from '../../hooks/queryCaching/usePaginatedQuery';
import PageLoader from '../../components/loaders/PageLoader/PageLoader';

const LoyaltyPogramHistoryData: React.FC = () => {

    const { loyaltyCurrency } = useParams<{ loyaltyCurrency: string }>();
    const { push } = useHistory();
    const { state } = useLocation();
    const { getTransactions } = useProgramsTransactionHistory({});

    const paginatedQuery = usePaginatedQuery({
        identity: ['loyltyProgramsHistory', loyaltyCurrency],
        getData: getTransactions,
        otherParams: loyaltyCurrency
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

    const onRefresh = useCallback((): Promise<any> => {
        return paginatedQuery.refetch()
    }, [loyaltyCurrency])

    return (
        <IonPage>
            <SecondaryHeader
                title={routingState?.loyaltyProgramName} />
            <PrimaryContainer
                scrollYAxis={false}
                isRefreshable
                onRefresh={onRefresh}>
                {
                    paginatedQuery.isLoading ?
                        <PageLoader />
                        :
                        paginatedQuery.data && paginatedQuery.data.length !== 0 &&
                        <Virtuoso
                            className="ion-content-scroll-host"
                            style={{ height: "83vh", }}
                            totalCount={1}
                            itemContent={() => {
                                return (

                                    <PrimaryGrid
                                        headers={['Date', 'Reason', 'Amount']}
                                        data={paginatedQuery.data?.map((hf: any) => (
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
                                        isLoading={paginatedQuery.isLoading}
                                        placeholder={<Placeholder />}
                                    />
                                )
                            }}
                            components={{
                                Footer: () => InfiniteScrollPagination(paginatedQuery.fetchNextPage, !paginatedQuery.hasNextPage)
                            }}>
                        </Virtuoso>
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default LoyaltyPogramHistoryData;