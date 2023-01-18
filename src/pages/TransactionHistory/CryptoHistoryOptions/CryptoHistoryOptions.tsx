import React from 'react';
import { CryptoAsset } from '../../../models/assets/CryptoAsset';
import TransactionHistoryOptions from '../TransactionHistoryOptions/TransactionHistoryOptions';

type Assets = CryptoAsset & { action: (asset: CryptoAsset) => void }

interface Props {
    assets?: Assets[]
}

const CryptoHistoryOptions: React.FC<Props> = ({ assets = [] }) => {
    return (
        <TransactionHistoryOptions
            items={assets.map(ca => {
                return {
                    name: ca.name,
                    logo: ca.logo ?? '',
                    onClick: () => ca.action(ca)
                }
            })}
        />
    )
}

export default CryptoHistoryOptions;