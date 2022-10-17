import { IonInput } from "@ionic/react";
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
    disabledQuantity?: boolean
}

const SwapField: React.FC<Props> = ({ label, selectedOption, onSelectionChange, options, quantity, onQuantityChange, disabledQuantity = false }) => {
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
                    disabled={disabledQuantity}
                    type='number'
                    onIonChange={(event) => {
                        onQuantityChange && onQuantityChange(event.detail.value ? parseInt(event.detail.value) : undefined)
                    }} />

                <PrimaryTypography size="m" customClassName={styles.postInput}>Units</PrimaryTypography>
            </div>
        </div>
    )
}

export default SwapField;