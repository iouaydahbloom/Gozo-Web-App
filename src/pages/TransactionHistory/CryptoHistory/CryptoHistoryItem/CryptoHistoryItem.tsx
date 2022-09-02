import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import { getEllipsisTxt } from '../../../../helpers/formatters';
import useWeb3 from '../../../../hooks/useBlockchain';
import styles from './cryptoHistoryItem.module.scss';

interface Props {
    amount: number,
    transactionHash: string
}

const CryptoHistoryItem: React.FC<Props> = ({ amount, transactionHash }) => {

    const { helpers } = useWeb3();

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
                        {parseFloat(helpers.Units.FromWei(amount, 18)).toFixed(3)}
                    </PrimaryTypography>
                </div>
            </div>
        </div>
    )
}

export default CryptoHistoryItem;