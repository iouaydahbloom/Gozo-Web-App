import React, { useCallback } from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../../../components/inputs/PrimarySelect/PrimarySelect';
import TransactionDetails from '../../../components/TransactionDetails/TransactionDetails';
import useTokenProgramsExchange from '../../../hooks/useTokenProgramsExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapTokens.module.scss';

const SwapTokens: React.FC = () => {

    const { tokenOptions, programOptions, token, tokenQuantity, setTokenQuantity, program,
        programQuantity, setProgramQuantity, exchanging, exchange, toggleDirection, direction,
        minimumValue, estimatedGasFee } = useTokenProgramsExchange();

    const renderTokensField = useCallback((label: string, isDisabled: boolean) => (
        <SwapField
            label={label}
            options={tokenOptions.map((opt) => (
                new SelectOption(opt.name, opt.token_address)
            ))}
            quantity={tokenQuantity}
            selectedOption={token?.token_address!}
            onQuantityChange={setTokenQuantity}
            disabledQuantity={isDisabled}
        />
    ), [tokenOptions, tokenQuantity])

    const renderProgramsField = useCallback((label: string, isDisabled: boolean) => (
        <SwapField
            label={label}
            options={programOptions.map((opt) => (
                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency)
            ))}
            quantity={programQuantity}
            selectedOption={program?.currency.loyaltyCurrency!}
            onQuantityChange={setProgramQuantity}
            disabledQuantity={isDisabled}
        />
    ), [programOptions, programQuantity])

    return (
        <div className={styles.swapContainer}>
            <div className={styles.swapControl}>
                {direction == 't2p' ? renderTokensField('From', false) : renderProgramsField('From', false)}
                <SwapDirection doubleDirection onClick={toggleDirection} />
                {direction == 'p2t' ? renderTokensField('To', true) : renderProgramsField('To', true)}
            </div>

            <TransactionDetails
                hasMinimumValue={true}
                minimumValue={minimumValue}
                showFeeEstimation={direction == "t2p"}
                estimatedFee={estimatedGasFee}
                estimatedFeeUnit='GZT'
            />

            <br />
            <PrimaryButton
                expand='block'
                onClick={exchange}
                disabled={exchanging}>
                swap
            </PrimaryButton>
        </div>
    )
}

export default SwapTokens;