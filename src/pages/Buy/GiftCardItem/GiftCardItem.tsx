import { useHistory } from "react-router"
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import { AppRoutes } from "../../../constants/appRoutes"
import { GiftCard } from "../../../models/giftCard"
import styles from './giftCardItem.module.scss'

interface Props {
    giftCard: GiftCard
}

const GiftCardItem: React.FC<Props> = ({ giftCard }) => {
    const { push } = useHistory();

    function goToDetails() {
        push(AppRoutes.getBuyGiftCardRoute(giftCard.id))
    }

    return (
        <div className={styles.container}>
            <PrimaryTypography customClassName="ion-padding-vertical">{giftCard.name}</PrimaryTypography>
            <div className={styles.cover} style={{ backgroundImage: `url(${giftCard.image})` }} onClick={goToDetails} />
            <div className={styles.info}>
                <PrimaryTypography size="xs">
                    {giftCard.currency} {giftCard.minimumValue} - {giftCard.maximumValue}
                </PrimaryTypography>
            </div>
        </div>
    )
}

export default GiftCardItem