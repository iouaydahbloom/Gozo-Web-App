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

    const renderTokensField = useCallback((
        label: string,
        isPassive: boolean,
        withAvailability: boolean,
        availability?: number,
        acceptedValue: boolean = true
    ) => (
        <SwapField
            label={label}
            options={tokenOptions.map((opt) => (
                new SelectOption(opt.name, opt.tokenAddress, opt.logo)
            ))}
            quantity={tokenQuantity}
            selectedOption={token?.tokenAddress!}
            onQuantityChange={setTokenQuantity}
            isPassive={isPassive}
            isLoadingQuantity={simulating}
            withAvailability={withAvailability}
            availability={availability}
            acceptedValue={acceptedValue}
        />
    ), [tokenOptions, tokenQuantity, simulating])

    const renderProgramsField = useCallback((
        label: string,
        isPassive: boolean,
        withAvailability: boolean,
        availability?: number,
        acceptedValue: boolean = true
    ) => (
        <SwapField
            label={label}
            options={programOptions.map((opt) => (
                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency, opt.currency.programLogo)
            ))}
            quantity={programQuantity}
            selectedOption={program?.currency.loyaltyCurrency!}
            onQuantityChange={setProgramQuantity}
            isPassive={isPassive}
            isLoadingQuantity={simulating}
            withAvailability={withAvailability}
            availability={availability}
            acceptedValue={acceptedValue}
        />
    ), [programOptions, programQuantity, simulating])

    return (
        <div className={styles.swapContainer}>
            <div className={styles.swapControl}>
                {
                    direction == 't2p' ?
                        renderTokensField('From', false, true, tokensBalance, !isDisabled) :
                        renderProgramsField('From', false, true, pointsBalance, !isDisabled)
                }
                <SwapDirection doubleDirection onClick={toggleDirection} />
                {
                    direction == 'p2t' ?
                        renderTokensField('To', true, false) :
                        renderProgramsField('To', true, false)
                }
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