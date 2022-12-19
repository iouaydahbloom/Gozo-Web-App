import { useState } from "react";
import PrimaryTypography, { PrimaryTypographyProps } from "../PrimaryTypography/PrimaryTypography";
import styles from './extendedText.module.scss';

interface Props extends PrimaryTypographyProps {
    text: string
}

const ExtendedText: React.FC<Props> = ({ text, ...otherProps }) => {

    const [isReadMore, setIsReadMore] = useState(true);

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    }

    return (
        <PrimaryTypography {...otherProps}>
            {isReadMore ? text!.slice(0, 150) : text}
            <span onClick={toggleReadMore} className={styles.readOrHide}>
                {isReadMore ? " ...read more" : " show less"}
            </span>
        </PrimaryTypography>
    );
};

export default ExtendedText;