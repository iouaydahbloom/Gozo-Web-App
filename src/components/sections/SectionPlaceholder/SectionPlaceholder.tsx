import { ReactNode } from "react"
import PrimaryTypography from "../../typography/PrimaryTypography/PrimaryTypography"
import styles from "./sectionPlaceholder.module.scss"

interface Props {
    title?: string,
    description?: string,
    logoUrl?: string,
    renderActions?: () => ReactNode
}

const SectionPlaceholder: React.FC<Props> = ({ title, description, logoUrl, renderActions }) => {
    return (
        <div className={styles.containerContent}>
            {logoUrl && <img src={logoUrl} />}
            {title && <PrimaryTypography size='xxl'>
                {title}
            </PrimaryTypography>
            }
            <br />
            {description &&
                <div>
                    <PrimaryTypography size='m'>
                        {description}
                    </PrimaryTypography>
                </div>
            }
            {
                renderActions && <>
                    <br />
                    {renderActions()}
                </>
            }
        </div>
    )
}

export default SectionPlaceholder