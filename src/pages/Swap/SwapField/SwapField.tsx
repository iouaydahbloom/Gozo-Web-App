import { IonInput } from "@ionic/react";
import { SelectOption } from "../../../components/inputs/PrimarySelect/PrimarySelect";
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
            {/* <PrimarySelect
                label={label}
                value={selectedOption}
                onChange={onSelectionChange}
                options={options} /> */}

            <IonInput
                color='light'
                className={styles.input}
                value={quantity}
                disabled={disabledQuantity}
                type='number'
                onIonChange={(event) => {
                    onQuantityChange && onQuantityChange(event.detail.value ? parseInt(event.detail.value) : undefined)
                }} />
        </div>
    )
}

export default SwapField;