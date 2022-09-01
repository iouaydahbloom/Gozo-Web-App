import React from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../../../components/inputs/PrimarySelect/PrimarySelect';
import useTokenProgramsExchange from '../../../hooks/useTokenProgramsExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapTokens.module.scss';

const SwapTokens: React.FC = () => {

    const { originOptions, destinationOptions, originToken, originTokenQuantity, setOriginTokenQuantity,
        destinationProgramQuantity, destinationProgram, exchange, exchanging } = useTokenProgramsExchange();

    return (
        <>
            <div className={styles.swapControl}>
                <SwapField
                    label='From'
                    options={originOptions.map((opt) => (
                        new SelectOption(opt.name, opt.token_address)
                    ))}
                    quantity={originTokenQuantity}
                    selectedOption={originToken?.token_address!}
                    onQuantityChange={setOriginTokenQuantity}
                />
                <SwapDirection />
                <SwapField
                    disabledQuantity
                    label='To'
                    options={destinationOptions.map((opt) => (
                        new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency)
                    ))}
                    quantity={destinationProgramQuantity}
                    selectedOption={destinationProgram?.currency.loyaltyCurrency!}
                />
            </div>
            <PrimaryButton
                expand='block'
                onClick={exchange}
                disabled={exchanging}>
                swap
            </PrimaryButton>
        </>
    )
}

export default SwapTokens;