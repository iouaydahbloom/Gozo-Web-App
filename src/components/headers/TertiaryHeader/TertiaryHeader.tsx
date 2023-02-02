import { IonHeader, IonToolbar, IonTitle, IonText } from '@ionic/react';
import PrimaryTypography from '../../typography/PrimaryTypography/PrimaryTypography';
import styles from './tertiaryHeader.module.scss';

interface Props {
    title: string,
    className?: string
}

const TertiaryHeader: React.FC<Props> = ({ title, className }) => {

    return (
        <IonHeader className={`${styles.header} ${className}`}>
            <IonToolbar className={styles.toolbar}>
                <PrimaryTypography size='m'>{title}</PrimaryTypography>
            </IonToolbar>
        </IonHeader>
    )
}

export default TertiaryHeader;