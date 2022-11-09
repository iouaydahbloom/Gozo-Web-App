import { useMoralis } from "react-moralis";
import { useHistory } from "react-router";
import PrimaryGrid from "../../../components/grids/PrimaryGrid/PrimaryGrid";
import PageLoader from "../../../components/loaders/PageLoader/PageLoader";
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography";
import { AppRoutes } from "../../../constants/appRoutes";
import { formatDate } from "../../../helpers/dateManagment";
import useERC20Transfers from "../../../hooks/useERC20Transfers";
import { useDapp } from "../../../providers/DappProvider/DappProvider";
import styles from './cryptoHistory.module.scss';

const CryptoHistory: React.FC = () => {
    const { eRC20Transfers, isLoadingTransfers } = useERC20Transfers();
    const { Moralis } = useMoralis();
    const { push } = useHistory();
    const { walletAddress } = useDapp();

    return (
        <div className={styles.container}>
            {!isLoadingTransfers ?
                <PrimaryGrid
                    headers={['Date', 'From', 'To', 'Amount']}
                    data={eRC20Transfers?.map(transfer => {
                        transfer = { ...transfer, value: Moralis.Units.FromWei(transfer.value, 18) }
                        return {
                            date: formatDate(transfer.block_timestamp),
                            from: walletAddress === transfer.from_address ?
                                <PrimaryTypography color='danger'>
                                    {transfer.from_address}
                                </PrimaryTypography>
                                :
                                transfer.from_address,
                            to: walletAddress === transfer.to_address ?
                                <PrimaryTypography color='success'>
                                    {transfer.to_address}
                                </PrimaryTypography>
                                :
                                transfer.to_address,
                            amount: transfer.value,
                            onClick: () => push(AppRoutes.tokenHistoryDetails, transfer)
                        }
                    })}
                />
                :
                <PageLoader />
            }
        </div>
    )
}

export default CryptoHistory;
