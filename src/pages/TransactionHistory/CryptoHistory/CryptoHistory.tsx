import { useMoralis } from "react-moralis";
import PrimaryGrid from "../../../components/grids/PrimaryGrid/PrimaryGrid";
import { stringToDate } from "../../../helpers/dateManagment";
import useERC20Transfers from "../../../hooks/useERC20Transfers";
import styles from './cryptoHistory.module.scss';

const CryptoHistory: React.FC = () => {
    const { eRC20Transfers } = useERC20Transfers();
    const { Moralis } = useMoralis();

    return (
        <div className={styles.container}>
            <PrimaryGrid
                headers={['Date', 'From', 'To', 'Amount']}
                data={eRC20Transfers?.map(hf => (
                    { date: stringToDate(hf.block_timestamp ?? ''), from: hf.transaction_hash, to: hf.to_address, amount: Moralis.Units.FromWei(hf.value, 18) }
                ))}
            />
        </div>
    )
}

export default CryptoHistory;
