import React, { useCallback } from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../../../components/inputs/PrimarySelect/PrimarySelect';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import useTokenProgramsExchange from '../../../hooks/useTokenProgramsExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapTokens.module.scss';

const SwapTokens: React.FC = () => {

    const { tokenOptions, programOptions, token, tokenQuantity, setTokenQuantity, program,
        programQuantity, setProgramQuantity, exchanging, exchange, toggleDirection, direction,
        minimumValue } = useTokenProgramsExchange();

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

            <div className={styles.infoAlert}>
                <div className={styles.gasFeeContainer}>
                    <PrimaryTypography customClassName={styles.gasFeeTitle}>Gas Fee</PrimaryTypography>
                    <PrimaryTypography customClassName={styles.gasFeeValue}>12 GZT</PrimaryTypography>
                </div>

                <PrimaryTypography isBold>Minimum Value</PrimaryTypography>
                <br />
                <PrimaryTypography>
                    Make sure to that you enter an amount higher than <strong>{minimumValue}</strong>
                </PrimaryTypography>
            </div>

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