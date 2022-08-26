import PrimaryTypography from "../../../../components/typography/PrimaryTypography/PrimaryTypography";
import styles from './cryptoTokenItem.module.scss';

interface Props {
    name: string,
    logo: string,
    balance: string | number,
    symbol: string
}

const CryptoTokenItem: React.FC<Props> = ({ name, logo, balance, symbol }) => {
    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div className={styles.id}>
                    <img src={logo} />
                    <PrimaryTypography>
                        {name}
                    </PrimaryTypography>
                </div>
                <PrimaryTypography>{balance} Token</PrimaryTypography>
            </div>

            <div className={styles.balance}>
                <PrimaryTypography>{balance} {symbol}</PrimaryTypography>
            </div>
        </div>
    )
}

export default CryptoTokenItem;