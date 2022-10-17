import { IonIcon } from "@ionic/react"
import { chevronDownOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import PrimaryTypography from "../../../components/typography/PrimaryTypography/PrimaryTypography"
import useSecondarySheet from "../../../hooks/useSecondarySheet"
import LoyaltyProgramOptions from "../LoyaltyProgramOptions/LoyaltyProgramOptions"
import styles from './programSelection.module.scss'

export class ProgramSelectOption {
    constructor(
        public name: string,
        public currency: string,
        public icon: string
        ) { }
}
 
interface Props {
    options: ProgramSelectOption[],
    selectedValue: string,
    selectedBalance: number,
    setSelectedValue: (name: string) => void
}

const ProgramSelection: React.FC<Props> = ({ options, selectedValue, selectedBalance, setSelectedValue }) => {
    const [value, setValue] = useState<string>('')

    const { showModal: showSelect, dismissModal: dismissSelect } = useSecondarySheet({
        title: '',
        component: <LoyaltyProgramOptions options={options} selectedValue={value} onClick={onClickProgram} handleSubmission={handleSubmission}/>,
        id: 'selectModal',
        onDismiss: () => {
            setValue(selectedValue)
        }
    });

    function onClickProgram(name: string) {
        setValue(name)
    }

    function handleSubmission() {
        setSelectedValue(value)
        dismissSelect()
    }

    useEffect(() => {
       setValue(selectedValue)
    }, [selectedValue])
    

    return (
        <div className={styles.select} onClick={showSelect} >
            <PrimaryTypography size='m' isBlock={false}>
              {selectedBalance} {selectedValue}
            </PrimaryTypography>
            <IonIcon size='large' color='light' icon={chevronDownOutline} />
        </div>
    )
}

export default ProgramSelection