import { useHistory } from "react-router";
import PrimaryGrid from "../../../components/grids/PrimaryGrid/PrimaryGrid";
import SectionPlaceholder from "../../../components/sections/SectionPlaceholder/SectionPlaceholder";
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography";
import { AppRoutes } from "../../../constants/appRoutes";
import { parseNumber } from "../../../helpers/blockchainHelper";
import { formatDate } from "../../../helpers/dateManagment";
import { ERC20Transfer } from "../../../models/assets/ERC20Transfer";
import { useDapp } from "../../../providers/DappProvider/DappProvider";
import styles from './cryptoHistory.module.scss';

interface Props {
    isLoading: boolean | undefined,
    eRC20Transfers: ERC20Transfer[] | undefined
}

const CryptoHistory: React.FC<Props> = ({ isLoading, eRC20Transfers }) => {

    const { push } = useHistory();
    const { walletAddress } = useDapp();

    const Placeholder = () => {
        return (
            <SectionPlaceholder
                description='You have no past transaction details here yet'
                logoUrl='assets/image/no-transactions.svg'
            />
        )
    }

    return (
        <div className={styles.container}>
            <PrimaryGrid
                headers={['Date', 'From', 'To', 'Amount']}
                data={eRC20Transfers?.map(transfer => {
                    transfer = { ...transfer, value: parseNumber(transfer.value) }
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
                        onClick: () => push(AppRoutes.tokenHistoryDetails, transfer)
                    }
                })}
                isLoading={isLoading}
                placeholder={<Placeholder />}
            />
        </div>
    )
}

export default CryptoHistory;
