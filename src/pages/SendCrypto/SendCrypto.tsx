import { IonIcon } from '@ionic/react';
import { scanOutline } from 'ionicons/icons';
import React, { useState } from 'react'
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../components/inputs/PrimaryInput/PrimaryInput';
import TransactionDetails from '../../components/TransactionDetails/TransactionDetails';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useBarcodeScanner from '../../hooks/useBarcodeScanner';
import useBlockchainTransfer from '../../hooks/useBlockchainTransfer';
import useToast from '../../hooks/useToast';
import styles from './sendCrypto.module.scss';

const SendCrypto: React.FC = () => {

    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const { transfer, transferFee, executing } = useBlockchainTransfer(receiver, amount);
    const { presentFailure } = useToast();
    const { scan } = useBarcodeScanner();

    async function handleTransfer() {
        if (receiver && amount) {
            await transfer();
        } else {
            presentFailure('You are missing some required fields')
        }
    }

    async function handleScan() {
        const result = await scan();
        setReceiver(result?.text);
    }

    return (
        <div>
            <PrimaryTypography>To:</PrimaryTypography>
            <div className={styles.receiverContainer}>
                <PrimaryInput
                    placeholder='Enter Receiver Address'
                    value={receiver}
                    onChange={setReceiver} />
                <IonIcon
                    icon={scanOutline}
                    onClick={handleScan}
                    size='large'
                    color='light'
                    className={styles.scan} />
            </div>
            <br />
            <PrimaryTypography>Amount:</PrimaryTypography>
            <PrimaryInput
                placeholder='Enter Amount'
                value={amount}
                onChange={setAmount} />
            <br />

            <TransactionDetails
                hasMinimumValue={false}
                showFeeEstimation={true}
                estimatedFee={transferFee}
                estimatedFeeUnit='GZT'
                notification='Transaction might take around 1 minute'
            />

            <br />
            <PrimaryButton
                expand='block'
                onClick={handleTransfer}
                disabled={executing}>
                send
            </PrimaryButton>
        </div>
    )
}

export default SendCrypto;