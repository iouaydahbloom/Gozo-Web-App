import { IonContent, IonHeader, IonList, IonRadioGroup } from "@ionic/react"
import { useState } from "react"
import PrimaryButton from "../../../components/buttons/PrimaryButton/PrimaryButton"
import PrimaryFooter from "../../../components/layout/PrimaryFooter/PrimaryFooter"

import LoyaltyProgramOptionItem from "../LoyaltyProgramOptionItem/LoyaltyProgramOptionItem"
import { ProgramSelectOption } from "../ProgramSelection/ProgramSelection"
import styles from './loyaltyProgramOptions.module.scss'

interface Props {
    options: ProgramSelectOption[],
    defaultSelected: string,
    onSelectionChange: (selected: string) => void
}

const LoyaltyProgramOptions: React.FC<Props> = ({ options, defaultSelected, onSelectionChange }) => {

    const [selectedValue, setSelectedValue] = useState(defaultSelected);

    return (
        <>
            <IonHeader className={`${styles.header} ion-no-border`} ></IonHeader>
            <IonContent className={styles.container}>
                <IonList className={styles.containerList}>
                    <IonRadioGroup value={selectedValue}>
                        {options.map((option, index) => {
                            return <LoyaltyProgramOptionItem
                                key={index}
                                name={option.name}
                                currency={option.currency}
                                icon={option.icon}
                                onClick={() => setSelectedValue(option.name)}
                                isActive={selectedValue === option.name}
                            />
                        })}
                    </IonRadioGroup>

                </IonList>
            </IonContent>
            <PrimaryFooter className={styles.footer}>
                <PrimaryButton
                    expand='block'
                    onClick={() => onSelectionChange(selectedValue)}>
                    Replace
                </PrimaryButton>
            </PrimaryFooter>
        </>
    )
}

export default LoyaltyProgramOptions