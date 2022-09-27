import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import styles from './tertiaryHeader.module.scss';

interface Props {
    title: string,
    className?: string
}

const TertiaryHeader: React.FC<Props> = ({ title, className }) => {

    return (
        <IonHeader className={`${styles.header} ${className}`}>
            <IonToolbar className={styles.toolbar}>
                <IonTitle>{title}</IonTitle>
            </IonToolbar>
        </IonHeader>
    )
}

export default TertiaryHeader;