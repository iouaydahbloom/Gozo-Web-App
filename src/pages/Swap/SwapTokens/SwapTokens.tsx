import React, { useCallback } from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../SwapSelect/SwapSelect';
import TransactionDetails from '../../../components/TransactionDetails/TransactionDetails';
import useTokenProgramsExchange from '../../../hooks/useTokenProgramsExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapTokens.module.scss';

const SwapTokens: React.FC = () => {

    const { tokenOptions, programOptions, token, tokenQuantity, setTokenQuantity, program,
        programQuantity, setProgramQuantity, exchanging, exchange, toggleDirection, direction,
        minimumValue, estimatedGasFee, isEstimatingGasFee, isDisabled, simulating, pointsBalance, 
        tokensBalance } = useTokenProgramsExchange();

    const renderTokensField = useCallback((label: string, isDisabled: boolean, withAvailability: boolean, availability?: number) => (
        <SwapField
            label={label}
            options={tokenOptions.map((opt) => (
                new SelectOption(opt.name, opt.token_address, opt.logo)
            ))}
            quantity={tokenQuantity}
            selectedOption={token?.token_address!}
            onQuantityChange={setTokenQuantity}
            isPassive={isDisabled}
            isLoadingQuantity={simulating}
            withAvailability={withAvailability}
            availability={availability}
        />
    ), [tokenOptions, tokenQuantity, simulating])

    const renderProgramsField = useCallback((label: string, isDisabled: boolean, withAvailability: boolean, availability?: number) => (
        <SwapField
            label={label}
            options={programOptions.map((opt) => (
                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency, opt.currency.programLogo)
            ))}
            quantity={programQuantity}
            selectedOption={program?.currency.loyaltyCurrency!}
            onQuantityChange={setProgramQuantity}
            isPassive={isDisabled}
            isLoadingQuantity={simulating}
            withAvailability={withAvailability}
            availability={availability}
        />
    ), [programOptions, programQuantity, simulating])

    return (
        <div className={styles.swapContainer}>
            <div className={styles.swapControl}>
                {direction == 't2p' ? renderTokensField('From', false, true, tokensBalance) : renderProgramsField('From', false, true, pointsBalance)}
                <SwapDirection doubleDirection onClick={toggleDirection} />
                {direction == 'p2t' ? renderTokensField('To', true, false) : renderProgramsField('To', true, false)}
            </div>

            <TransactionDetails
                hasMinimumValue={true}
                minimumValue={minimumValue}
                showFeeEstimation={direction == "t2p"}
                isEstimatingFee={isEstimatingGasFee}
                estimatedFee={estimatedGasFee}
                estimatedFeeUnit='GZT'
                notification={direction == "t2p" ? 'Transaction might take around 1 min' : ''}
            />

            <br />
            <PrimaryButton
                expand='block'
                onClick={exchange}
                disabled={isDisabled}
                loading={exchanging}>
                swap
            </PrimaryButton>
        </div>
    )
}

export default SwapTokens;