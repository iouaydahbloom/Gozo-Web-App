import React from 'react';
import { AssetMode } from '../../constants/assetsMode';
import SwapPoints from './SwapPoints/SwapPoints';
import SwapTokens from './SwapTokens/SwapTokens';

interface Props {
    mode: AssetMode
}

const Swap: React.FC<Props> = ({ mode }) => {
    return (
        <>
            {mode === AssetMode.loyaltyPoint ? <SwapPoints /> : <SwapTokens />}
        </>
    )
}

export default Swap;