import { IonContent, IonHeader, IonList, IonRadioGroup } from "@ionic/react"
import PrimaryButton from "../../../components/buttons/PrimaryButton/PrimaryButton"
import PrimaryFooter from "../../../components/layout/PrimaryFooter/PrimaryFooter"

import LoyaltyProgramOptionItem from "../LoyaltyProgramOptionItem/LoyaltyProgramOptionItem"
import { ProgramSelectOption } from "../ProgramSelection/ProgramSelection"
import styles from './loyaltyProgramOptions.module.scss'

interface Props {
    options: ProgramSelectOption[],
    selectedValue: string,
    onClick: (name: string) => void,
    handleSubmission: () => void
}

const LoyaltyProgramOptions: React.FC<Props> = ({ options, selectedValue, onClick, handleSubmission }) => {
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
                                onClick={onClick}
                                isActive={selectedValue === option.name ? true : false}
                            />
                        })}
                    </IonRadioGroup>

                </IonList>
            </IonContent>
            <PrimaryFooter className={styles.footer}>
                <PrimaryButton expand='block' onClick={handleSubmission}>
                    Replace
                </PrimaryButton>
            </PrimaryFooter>
        </>
    )
}

export default LoyaltyProgramOptions