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
                    data={eRC20Transfers?.map(hf => (
                        {
                            date: formatDate(hf.block_timestamp),
                            from: walletAddress === hf.from_address ?
                                <PrimaryTypography color='danger'>
                                    {hf.from_address}
                                </PrimaryTypography>
                                :
                                hf.from_address,
                            to: walletAddress === hf.to_address ?
                                <PrimaryTypography color='success'>
                                    {hf.to_address}
                                </PrimaryTypography>
                                :
                                hf.to_address,
                            amount: Moralis.Units.FromWei(hf.value, 18),
                            onClick: () => push(AppRoutes.tokenHistoryDetails, hf)
                        }
                    ))}
                />
                :
                <PageLoader />
            }
        </div>
    )
}

export default CryptoHistory;
