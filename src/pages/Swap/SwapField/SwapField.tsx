import { IonInput, IonSpinner } from "@ionic/react";
import SwapSelect, { SelectOption } from "../SwapSelect/SwapSelect";
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography";
import styles from './swapField.module.scss';

interface Props {
    label: string,
    selectedOption: string,
    onSelectionChange?: (value: string) => void,
    options: SelectOption[],
    quantity?: number,
    onQuantityChange?: (value?: number) => void,
    isPassive?: boolean,
    isLoadingQuantity?: boolean,
    withAvailability?: boolean,
    availability?: number,
    acceptedValue?: boolean
}

const SwapField: React.FC<Props> = ({
    label,
    selectedOption,
    onSelectionChange,
    options,
    quantity,
    onQuantityChange,
    isPassive = false,
    isLoadingQuantity = false,
    withAvailability = false,
    availability = 0,
    acceptedValue = true
}) => {
    return (
        <div className={`${styles.swapFieldContainer}`}>
            <div className={`${styles.swapField} ${withAvailability ? styles.withAvailability : ''}`}>
                <div className={styles.selectContainer}>
                    <SwapSelect
                        label={label}
                        className={styles.select}
                        value={selectedOption}
                        onChange={onSelectionChange}
                        options={options} />
                </div>
                <div className={styles.inputContainer}>
                    <IonInput
                        id={label.toLowerCase()}
                        color={acceptedValue ? 'light' : 'danger'}
                        className={styles.input}
                        value={quantity}
                        disabled={isPassive}
                        type='number'
                        min={0}
                        onIonChange={(event) => {
                            onQuantityChange && onQuantityChange(event.detail.value ? parseFloat(event.detail.value) : undefined)
                        }} />

                    {isPassive && isLoadingQuantity && <IonSpinner color='light' className={styles.spinner} />}

                    <PrimaryTypography size="m" customClassName={styles.postInput}>Units</PrimaryTypography>
                </div>
            </div>
            {
                withAvailability &&
                <PrimaryTypography size='xs' customClassName={styles.availability}>Available: {availability}</PrimaryTypography>
            }
        </div>
    )
}

export default SwapField;