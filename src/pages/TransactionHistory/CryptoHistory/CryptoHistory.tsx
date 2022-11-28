import { useMoralis } from "react-moralis";
import { useHistory } from "react-router";
import PrimaryButton from "../../../components/buttons/PrimaryButton/PrimaryButton";
import PrimaryGrid from "../../../components/grids/PrimaryGrid/PrimaryGrid";
import SectionPlaceholder from "../../../components/sections/SectionPlaceholder/SectionPlaceholder";
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography";
import { AppRoutes } from "../../../constants/appRoutes";
import { formatDate } from "../../../helpers/dateManagment";
import { ERC20Transfer } from "../../../models/assets/ERC20Transfer";
import { useDapp } from "../../../providers/DappProvider/DappProvider";
import styles from './cryptoHistory.module.scss';

interface Props {
    isLoading: boolean | undefined,
    eRC20Transfers: ERC20Transfer[] | undefined
}

const CryptoHistory: React.FC<Props> = ({ isLoading, eRC20Transfers }) => {
    const { Moralis } = useMoralis();
    const { push } = useHistory();
    const { walletAddress } = useDapp();

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
                isLoading={isLoading}
                placeholder={<Placeholder/>}
            />
        </div>
    )
}

export default CryptoHistory;
