import PrimaryTypography from "../../typography/PrimaryTypography/PrimaryTypography"
import styles from "./underConstruction.module.scss"

interface Props {
    description: string
}

const UnderConstruction: React.FC<Props> = ({ description }) => {
    return (
        <div className={styles.containerContent}>
            <img src='assets/image/coming-soon.svg' />
            <PrimaryTypography size='xxl'>
                Coming soon!
            </PrimaryTypography>
            <br />
            <div>
                <PrimaryTypography size='m'>
                    {description}
                </PrimaryTypography>
            </div>
        </div>
    )
}

export default UnderConstruction