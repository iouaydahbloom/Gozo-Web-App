import React from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../../../components/inputs/PrimarySelect/PrimarySelect';
import useProgramsExchange from '../../../hooks/useProgramsExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapPoints.module.scss';

const SwapPoints: React.FC = () => {

    const { originOptions, destinationOptions, originProgram,
        setOriginProgram, destinationProgram, setDestinationProgram,
        exchange, exchanging } = useProgramsExchange();

    return (
        <>
            <div className={styles.swapControl}>
                <SwapField
                    label='From'
                    options={originOptions.map((opt) => (
                        new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency)
                    ))}
                    quantity={originProgram.quantity}
                    selectedOption={originProgram?.loyaltyCurrency}
                    onQuantityChange={(quantity) => setOriginProgram({ ...originProgram, quantity: quantity })}
                    onSelectionChange={(value) => setOriginProgram({ ...originProgram, loyaltyCurrency: value })}
                />
                <SwapDirection />
                <SwapField
                    disabledQuantity
                    label='To'
                    options={destinationOptions.map((opt) => (
                        new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency)
                    ))}
                    quantity={destinationProgram.quantity}
                    selectedOption={destinationProgram?.loyaltyCurrency}
                    onSelectionChange={(value) => setDestinationProgram({ ...destinationProgram, loyaltyCurrency: value })}
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

export default SwapPoints;