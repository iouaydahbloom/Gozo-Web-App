import { IonIcon, IonSelect, IonSelectOption, IonSpinner } from "@ionic/react";
import { chevronDownOutline } from "ionicons/icons";
import { useRef } from "react";
import { SelectChangeEventDetail } from "@ionic/core";
import styles from './secondarySelect.module.scss';

export class SelectOption {
    constructor(public label: string,
        public value: string) { }
}

interface Props {
    id?: string,
    label?: string,
    placeholder?: string,
    name?: string,
    options?: SelectOption[],
    type?: "action-sheet" | "alert" | "popover"
    value?: string,
    required?: boolean,
    disabled?: boolean,
    onChange?: (event: CustomEvent<SelectChangeEventDetail>) => void
}

const SecondarySelect: React.FC<Props> =
    ({ id, name, label, placeholder, type="alert", options = [], value, required = false, onChange, disabled }) => {

        const selectRef = useRef<HTMLIonSelectElement>(null);

        return (
            <div className={styles.secondarySelectContainer}>
                {label && <p className={styles.label}>{label}</p>}
                <div className={styles.secondarySelect}>
                    {options.length == 0 &&
                        <div className={styles.secondarySelectLoading}>
                            <span>{placeholder}</span>
                            <IonSpinner name="crescent" />
                        </div>}
                    {options.length > 0 && <>
                        <IonSelect
                            ref={selectRef}
                            id={id}
                            name={name}
                            className={styles.select}
                            placeholder={placeholder}
                            disabled={disabled}
                            onIonChange={onChange}
                            interface={type}
                            value={value}
                        >
                            {!required && <IonSelectOption
                                className={styles.secondarySelectReset}
                                key={0}
                                value={null}>
                                {placeholder}
                            </IonSelectOption>}
                            {
                                options && options.map((option, index) => {
                                    return <IonSelectOption key={index} value={option.value}>{option.label}</IonSelectOption>
                                })
                            }
                        </IonSelect>
                        <div className={styles.secondarySelectIcon} onClick={() => selectRef.current?.open()}>
                            <IonIcon icon={chevronDownOutline}></IonIcon>
                        </div>
                    </>}
                </div>
            </div>
        )
    }
export default SecondarySelect;
