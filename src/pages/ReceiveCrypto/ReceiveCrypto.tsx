import { IonIcon } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import React from 'react'
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { useDapp } from '../../providers/DappProvider/DappProvider';
import styles from './receiveCrypto.module.scss';
import PrimaryBarcode from '../../components/barcodes/PrimaryBarcode/PrimaryBarcode';
import useClipboard from '../../hooks/useClipboard';
import useToast from '../../hooks/useToast';

const ReceiveCrypto: React.FC = () => {

    const { walletAddress } = useDapp();
    const { copy } = useClipboard();
    const { presentSuccess } = useToast();

    return (
        <div>
            <PrimaryTypography>
                Your Address &nbsp;
                <IonIcon
                    icon={copyOutline}
                    onClick={() => {
                        copy(walletAddress ?? '');
                        presentSuccess('Copied to clipboard');
                    }} />
            </PrimaryTypography>
            <div className={styles.myWalletContainer}>
                <PrimaryTypography>{walletAddress}</PrimaryTypography>
            </div>
            <br />
            <PrimaryBarcode data={walletAddress ?? ''} />
        </div>
    )
}

export default ReceiveCrypto;