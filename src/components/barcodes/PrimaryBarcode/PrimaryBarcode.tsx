import React from 'react';
import styles from './primaryBarcode.module.scss';

interface Props {
    data: string
}

const PrimaryBarcode: React.FC<Props> = ({ data }) => {
    return (
        <div className={styles.container}>
            <iframe
                className={styles.barcode}
                src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${data}&choe=UTF-8`} />
        </div>
    )
}

export default PrimaryBarcode;