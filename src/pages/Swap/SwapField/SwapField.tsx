import { IonInput, IonSpinner } from "@ionic/react";
import PrimarySelect, { SelectOption } from "../../../components/inputs/PrimarySelect/PrimarySelect";
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
    isLoadingQuantity?: boolean
}

const SwapField: React.FC<Props> = ({
    label,
    selectedOption,
    onSelectionChange,
    options,
    quantity,
    onQuantityChange,
    isPassive = false,
    isLoadingQuantity = false
}) => {
    return (
        <div className={styles.swapField}>
            <div className={styles.selectContainer}>
                <PrimarySelect
                    label={label}
                    className={styles.select}
                    value={selectedOption}
                    onChange={onSelectionChange}
                    options={options} />
            </div>
            <div className={styles.inputContainer}>
                <IonInput
                    color='light'
                    className={styles.input}
                    value={quantity}
                    disabled={isPassive}
                    type='number'
                    onIonChange={(event) => {
                        onQuantityChange && onQuantityChange(event.detail.value ? parseInt(event.detail.value) : undefined)
                    }} />

                {isPassive && isLoadingQuantity && <IonSpinner color='light' className={styles.spinner}/>}

                <PrimaryTypography size="m" customClassName={styles.postInput}>Units</PrimaryTypography>
            </div>
        </div>
    )
}

export default SwapField;