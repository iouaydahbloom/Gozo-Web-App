import {IonPage, useIonViewWillEnter} from "@ionic/react";
import {useHistory, useParams} from "react-router";
import {Virtuoso} from "react-virtuoso";
import PrimaryGrid from "../../components/grids/PrimaryGrid/PrimaryGrid";
import SecondaryHeader from "../../components/headers/SecondaryHeader/SecondaryHeader";
import {InfiniteScrollPagination} from "../../components/InfiniteScrollPagination/InfiniteScrollPagination";
import PrimaryContainer from "../../components/layout/PrimaryContainer/PrimaryContainer";
import SectionPlaceholder from "../../components/sections/SectionPlaceholder/SectionPlaceholder";
import PrimaryTypography from "../../components/typography/PrimaryTypography/PrimaryTypography";
import {AppRoutes} from "../../constants/appRoutes";
import cryptoAsset from "../../constants/cryptoAsset";
import {parseNumber} from "../../helpers/blockchainHelper";
import {formatDate} from "../../helpers/dateManagment";
import useAuthentication from "../../hooks/useAuthentication";
import useCryptoTransfers from "../../hooks/cryptoTransfers/useCryptoTransfers";
import useServerPagination from "../../hooks/useServerPagination";
import {CryptoTransfer} from "../../models/assets/ERC20Transfer";
import {useDapp} from "../../providers/DappProvider/DappProvider";
import React from "react";

const CryptoHistoryData: React.FC = () => {

    const {isAuthenticated} = useAuthentication();
    const {name: cryptoName} = useParams<{ name: string }>();
    const {push} = useHistory();
    const {getERC20Transfers, getNativeTransfers} = useCryptoTransfers({});
    const {
        data,
        isLoading,
        hasMore,
        loadMore,
        fetchData
    } = useServerPagination<CryptoTransfer, any>({
        getData: cryptoName == cryptoAsset.AVAX ? getNativeTransfers : getERC20Transfers as any
    });

    const {walletAddress} = useDapp();

    const Placeholder = () => {
        return (
            <SectionPlaceholder
                description='You have no past transaction details here yet'
                logoUrl='assets/image/no-transactions.svg'
            />
        )
    }

    useIonViewWillEnter(() => {
        fetchData();
    }, [cryptoName, isAuthenticated])

    return (
        <IonPage>
            <SecondaryHeader
                title={cryptoName}/>
            <PrimaryContainer
                scrollYAxis={false}
                isRefreshable
                onRefresh={fetchData}>
                <Virtuoso
                    className="ion-content-scroll-host"
                    style={{height: "83vh",}}
                    totalCount={1}
                    itemContent={() => {
                        return (
                            <PrimaryGrid
                                headers={['Date', 'From', 'To', 'Amount']}
                                data={data?.map(transfer => {
                                    transfer = {...transfer, value: parseNumber(transfer.value)}
                                    return {
                                        date: formatDate(transfer.blockTimestamp),
                                        from: walletAddress === transfer.fromAddress ?
                                            <PrimaryTypography color='danger'>
                                                {transfer.fromAddress}
                                            </PrimaryTypography>
                                            :
                                            transfer.fromAddress,
                                        to: walletAddress === transfer.toAddress ?
                                            <PrimaryTypography color='success'>
                                                {transfer.toAddress}
                                            </PrimaryTypography>
                                            :
                                            transfer.toAddress,
                                        amount: transfer.value,
                                        onClick: () => push(
                                            AppRoutes.getCryptoTransactionHistoryDetailsRoute(cryptoName, transfer.transactionHash),
                                            transfer
                                        )
                                    }
                                })}
                                isLoading={isLoading}
                                placeholder={<Placeholder/>}
                            />
                        )
                    }}
                    components={{
                        Footer: () => InfiniteScrollPagination(loadMore, !hasMore)
                    }}>
                </Virtuoso>
            </PrimaryContainer>
        </IonPage>
    )
}

export default CryptoHistoryData;
