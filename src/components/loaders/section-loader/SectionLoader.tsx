import { IonSpinner } from '@ionic/react';
import { memo } from 'react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './sectionLoader.module.scss';

interface IProps {
    text?: string,
    type?: 'block' | 'overlay',
    spinnerName?: 'circles' | 'crescent',
    color?: 'primary' | 'light',
    className?: string
}

const SectionLoaderComponent: React.FC<IProps> = ({
    text = 'Please wait...',
    type = 'block',
    spinnerName = 'circles',
    color = 'primary',
    className
}) => {
    return (
        <div className={`${styles.container}  ${type} ${className}`}>
            <IonSpinner name={spinnerName} color={color} />
            <PrimaryTypography customClassName={styles.description}>
                {text}
            </PrimaryTypography>
        </div>
    )
}


const SectionLoader = memo(SectionLoaderComponent);

export default SectionLoader