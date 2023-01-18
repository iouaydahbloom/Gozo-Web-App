import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { parseNumber } from '../../../helpers/blockchainHelper';
import { getEllipsisTxt } from '../../../helpers/formatters';
import styles from './cryptoHistoryItem.module.scss';

interface Props {
    amount: number,
    transactionHash: string
}

const CryptoHistoryItem: React.FC<Props> = ({ amount, transactionHash }) => {

    return (
        <div className={styles.itemContainer}>
            <div className={styles.itemdiv}>
                <div>
                    <PrimaryTypography>#</PrimaryTypography>
                </div>
                <div>
                    <PrimaryTypography>{getEllipsisTxt(transactionHash, 7)}</PrimaryTypography>
                </div>

                <div
                    style={{ flex: 1, justifyContent: "center", alignItems: "flex-end" }}>
                    <PrimaryTypography>
                        {parseFloat(parseNumber(amount)).toFixed(3)}
                    </PrimaryTypography>
                </div>
            </div>
        </div>
    )
}

export default CryptoHistoryItem;