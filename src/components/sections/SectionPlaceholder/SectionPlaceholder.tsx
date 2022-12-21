import { ReactNode } from "react"
import PrimaryTypography from "../../typography/PrimaryTypography/PrimaryTypography"
import styles from "./sectionPlaceholder.module.scss"

interface Props {
    title?: string,
    description?: string,
    logoUrl?: string,
    renderActions?: () => ReactNode,
    className?: string
}

const SectionPlaceholder: React.FC<Props> = ({ title, description, logoUrl, renderActions, className }) => {
    return (
        <div className={`${styles.containerContent} ${className}`}>
            {logoUrl && <img src={logoUrl} alt='' />}
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