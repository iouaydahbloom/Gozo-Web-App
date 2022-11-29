import { IonAvatar, IonItem, IonLabel } from "@ionic/react";
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
            <IonItem lines="none" className={styles.info}>
                <IonAvatar slot="start">
                    <img alt='' src={logo ? logo : "assets/image/image-placeholder.svg"} />
                </IonAvatar>
                <IonLabel>
                    <PrimaryTypography color='light' isBold size='m'>{name}</PrimaryTypography>
                </IonLabel>
            </IonItem >

            <div className={styles.balance}>
                <PrimaryTypography color='light' isBold size='m'>{balance} {symbol}</PrimaryTypography>
            </div>
        </div>
    )
}

export default CryptoTokenItem;