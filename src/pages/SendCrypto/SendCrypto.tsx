import { IonIcon } from '@ionic/react';
import { scanOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react'
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryInput from '../../components/inputs/PrimaryInput/PrimaryInput';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useBarcodeScanner from '../../hooks/useBarcodeScanner';
import useBlockchainTransfer from '../../hooks/useBlockchainTransfer';
import useToast from '../../hooks/useToast';
import styles from './sendCrypto.module.scss';

const SendCrypto: React.FC = () => {

    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const { transfer, error, executing } = useBlockchainTransfer(receiver, amount);
    const { presentFailure, presentSuccess } = useToast();
    const { scan } = useBarcodeScanner();

    async function handleTransfer() {
        if (receiver && amount) {
            const result = await transfer();
            if (result && result.status) presentSuccess('successfuly transfered');
        } else {
            presentFailure('You are missing some required fields')
        }
    }

    async function handleScan() {
        const result = await scan();
        setReceiver(result?.text);
    }

    useEffect(() => {
        if (error) {
            console.log(error);
            presentFailure(error);
        }
    }, [error])

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