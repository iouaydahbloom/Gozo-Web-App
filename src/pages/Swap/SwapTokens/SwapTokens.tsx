import React, { useCallback } from 'react'
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { SelectOption } from '../SwapSelect/SwapSelect';
import TransactionDetails from '../../../components/TransactionDetails/TransactionDetails';
import useTokenToOthersExchange, { NATIVE_CRYPTO_IDENTIFIER, SwapPartyType } from '../../../hooks/useTokenToOthersExchange';
import SwapDirection from '../SwapDirectionToggle/SwapDirectionToggle';
import SwapField from '../SwapField/SwapField';
import styles from './swapTokens.module.scss';
import { UserLoyaltyProgram } from '../../../models/loyaltyProgram';
import { NativeAsset } from '../../../models/assets/NativeAsset';

const SwapTokens: React.FC = () => {

    const { tokenOptions, othersOptions, token, tokenQuantity, setTokenQuantity, selectedOthers,
        setSelectedOthers, exchanging, exchange, toggleDirection, direction,
        minimumValue, estimatedGasFee, isEstimatingGasFee, isDisabled, simulating, displayedBalance } = useTokenToOthersExchange();

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

    const renderOthersField = useCallback((
        label: string,
        isPassive: boolean,
        withAvailability: boolean,
        availability?: number,
        acceptedValue: boolean = true
    ) => (
        <SwapField
            label={label}
            options={othersOptions.map((opt) => renderOthersOption(opt)
            )}
            quantity={selectedOthers?.quantity}
            selectedOption={selectedOthers.id}
            onSelectionChange={(value) => {
                setSelectedOthers({
                    ...selectedOthers,
                    id: value,
                    type: value === NATIVE_CRYPTO_IDENTIFIER ?
                        SwapPartyType.nativeCryptoCurrency :
                        SwapPartyType.loyaltyProgram
                })
            }}
            onQuantityChange={(value) => setSelectedOthers({ ...selectedOthers, quantity: value })}
            isPassive={isPassive}
            isLoadingQuantity={simulating}
            withAvailability={withAvailability}
            availability={availability}
            acceptedValue={acceptedValue}
        />
    ), [othersOptions, selectedOthers, simulating])

    function renderOthersOption(option: UserLoyaltyProgram | NativeAsset) {
        return option instanceof UserLoyaltyProgram ?
            new SelectOption(
                option.currency.loyaltyCurrencyName,
                option.currency.loyaltyCurrency,
                option.currency.programLogo
            )
            :
            new SelectOption(
                option.name,
                NATIVE_CRYPTO_IDENTIFIER,
                option.logo
            )
    }

    return (
        <div className={styles.swapContainer}>
            <div className={styles.swapControl}>
                {
                    direction === 't2o' ?
                        renderTokensField('From', false, true, displayedBalance, !isDisabled) :
                        renderOthersField('From', false, true, displayedBalance, !isDisabled)
                }
                <SwapDirection doubleDirection onClick={toggleDirection} />
                {
                    direction === 'o2t' ?
                        renderTokensField('To', true, false) :
                        renderOthersField('To', true, false)
                }
            </div>

            <TransactionDetails
                hasMinimumValue={selectedOthers.type === SwapPartyType.loyaltyProgram}
                minimumValue={minimumValue}
                showFeeEstimation={direction === "t2o"}
                isEstimatingFee={isEstimatingGasFee}
                estimatedFee={estimatedGasFee}
                estimatedFeeUnit='GZT'
                notification={direction === "t2o" ? 'Transaction might take around 1 min' : ''}
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