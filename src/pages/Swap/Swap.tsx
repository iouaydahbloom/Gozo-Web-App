import React from 'react';
import PrimaryModal from '../../components/modals/PrimaryModal/PrimaryModal';
import { AssetMode } from '../../constants/assetsMode';
import SwapPoints from './SwapPoints/SwapPoints';
import SwapTokens from './SwapTokens/SwapTokens';

interface Props {
    mode: AssetMode
}

const Swap: React.FC<Props> = ({ mode }) => {
    return (
        <PrimaryModal
            title='Swap'
            renderBody={() => (
                <>
                    {mode == AssetMode.loyaltyPoint ? <SwapPoints /> : <SwapTokens />}
                </>
            )}
        />
    )
}

export default Swap;