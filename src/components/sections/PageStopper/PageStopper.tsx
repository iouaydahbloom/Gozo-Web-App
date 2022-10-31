import { ReactNode } from "react"
import PrimaryTypography from "../../typography/PrimaryTypography/PrimaryTypography"
import styles from "./pageStopper.module.scss"

interface Props {
    title: string,
    description: string,
    logoUrl: string,
    renderActions?: () => ReactNode
}

const PageStopper: React.FC<Props> = ({ title, description, logoUrl, renderActions }) => {
    return (
        <div className={styles.containerContent}>
            <img src={logoUrl} />
            <PrimaryTypography size='xxl'>
                {title}
            </PrimaryTypography>
            <br />
            <div>
                <PrimaryTypography size='m'>
                    {description}
                </PrimaryTypography>
            </div>
            {
                renderActions && <>
                    <br />
                    {renderActions()}
                </>
            }
        </div>
    )
}

export default PageStopper