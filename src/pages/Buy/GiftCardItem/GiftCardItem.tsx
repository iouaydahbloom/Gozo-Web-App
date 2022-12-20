import { useHistory } from "react-router"
import PrimaryAccordion from "../../../components/accordions/PrimaryAccordion/PrimaryAccordion"
import PrimaryButton from "../../../components/buttons/PrimaryButton/PrimaryButton"
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
            <PrimaryAccordion
                className={styles.accordion}
                accordionItem={[
                    {
                        icon: 'assets/image/information-icon.png',
                        value: giftCard.id,
                        label: 'Card Details',
                        content: (
                            <div className={styles.accordionContent}>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Description:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>{giftCard.description}</PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Fiat Currency:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>{giftCard.currency}</PrimaryTypography>
                                </div>
                                <div className={styles.row}>
                                    <PrimaryTypography customClassName={styles.column}>Validity Term:</PrimaryTypography>
                                    <PrimaryTypography customClassName={styles.column}>{giftCard.validity}</PrimaryTypography>
                                </div>
                                <PrimaryButton
                                    customStyles='ion-margin-vertical'
                                    size="s"
                                    onClick={goToDetails}
                                >Read more</PrimaryButton>
                            </div>
                        )
                    }
                ]}
            />
        </div>
    )
}

export default GiftCardItem