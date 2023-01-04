import React from 'react';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../SwapSelect/SwapSelect';
import useProgramsExchange from '../../../hooks/useProgramsExchange/useProgramsExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapPoints.module.scss';

const SwapPoints: React.FC = () => {

    const { exchangeInOptions, exchangeOutOptions, defaultExchangeOptions, originProgram, setOriginProgram,
        destinationProgram, setDestinationProgram, exchange, exchanging, direction, toggleDirection,
        isDisabled, simulating, originBalance } = useProgramsExchange();

    return (
        <>
            <div className={styles.swapControl}>
                {
                    direction === 'p2s' ?
                        <SwapField
                            label='From'
                            options={exchangeInOptions.map((opt) => (
                                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency, opt.currency.programLogo)
                            ))}
                            quantity={originProgram.quantity}
                            selectedOption={originProgram?.loyaltyCurrency}
                            onQuantityChange={(quantity) => setOriginProgram({ ...originProgram, quantity: quantity })}
                            onSelectionChange={(value) => setOriginProgram({ ...originProgram, loyaltyCurrency: value })}
                            withAvailability
                            availability={originBalance}
                            acceptedValue={!isDisabled}
                        />
                        :
                        <SwapField
                            label='From'
                            options={defaultExchangeOptions.map((opt) => (
                                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency, opt.currency.programLogo)
                            ))}
                            quantity={originProgram.quantity}
                            selectedOption={originProgram?.loyaltyCurrency}
                            onQuantityChange={(quantity) => setOriginProgram({ ...originProgram, quantity: quantity })}
                            onSelectionChange={(value) => setOriginProgram({ ...originProgram, loyaltyCurrency: value })}
                            withAvailability
                            availability={originBalance}
                            acceptedValue={!isDisabled}
                        />
                }
                <SwapDirection doubleDirection onClick={toggleDirection} />
                {
                    direction === 's2p' ?
                        <SwapField
                            label='To'
                            options={exchangeOutOptions.map((opt) => (
                                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency, opt.currency.programLogo)
                            ))}
                            quantity={destinationProgram.quantity}
                            selectedOption={destinationProgram?.loyaltyCurrency}
                            onQuantityChange={(quantity) => setDestinationProgram({ ...destinationProgram, quantity: quantity })}
                            onSelectionChange={(value) => setDestinationProgram({ ...destinationProgram, loyaltyCurrency: value })}
                            isPassive={true}
                            isLoadingQuantity={simulating}
                        />
                        :
                        <SwapField
                            label='To'
                            options={defaultExchangeOptions.map((opt) => (
                                new SelectOption(opt.currency.loyaltyCurrencyName, opt.currency.loyaltyCurrency, opt.currency.programLogo)
                            ))}
                            quantity={destinationProgram.quantity}
                            selectedOption={destinationProgram?.loyaltyCurrency}
                            onQuantityChange={(quantity) => setDestinationProgram({ ...destinationProgram, quantity: quantity })}
                            onSelectionChange={(value) => setDestinationProgram({ ...destinationProgram, loyaltyCurrency: value })}
                            isPassive={true}
                            isLoadingQuantity={simulating}
                        />
                }
            </div>
            <PrimaryButton
                expand='block'
                onClick={() => exchange({})}
                loading={exchanging}
                disabled={isDisabled}>
                swap
            </PrimaryButton>
        </>
    )
}

export default SwapPoints;