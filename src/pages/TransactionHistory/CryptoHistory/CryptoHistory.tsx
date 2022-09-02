import PrimaryGrid from "../../../components/grids/PrimaryGrid/PrimaryGrid";
import useWeb3 from "../../../hooks/useBlockchain";
import useERC20Transfers from "../../../hooks/useERC20Transfers";
import styles from './cryptoHistory.module.scss';

const CryptoHistory: React.FC = () => {
    const { eRC20Transfers } = useERC20Transfers();
    const { helpers } = useWeb3();

    return (
        <div className={styles.container}>
            <PrimaryGrid
                headers={['#', 'To', 'Amount']}
                data={eRC20Transfers?.map(hf => (
                    { hash: hf.transaction_hash, reason: hf.to_address, amount: helpers.Units.FromWei(hf.value, 18) }
                ))}
            />
        </div>
    )
}

export default CryptoHistory;
