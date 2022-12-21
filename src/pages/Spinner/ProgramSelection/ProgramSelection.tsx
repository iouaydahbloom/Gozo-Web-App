import { IonIcon } from "@ionic/react"
import { chevronDownOutline } from "ionicons/icons"
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
    onValueChange: (value: string) => void,
    className?: string
}

const ProgramSelection: React.FC<Props> = ({ options, selectedValue, onValueChange, className }) => {

    const { showModal: showSelect, dismissModal: dismissSelect } = useSecondarySheet({
        title: '',
        component: <LoyaltyProgramOptions
            options={options}
            defaultSelected={selectedValue}
            onSelectionChange={onSelectionChange} />,
        id: 'selectModal'
    });

    function onSelectionChange(value: string) {
        onValueChange(value);
        dismissSelect();
    }

    return (
        <div className={`${styles.select} ${className}`} onClick={showSelect} >
            <PrimaryTypography size='m' isBlock={false}>
                {selectedValue}
            </PrimaryTypography>
            <IonIcon size='large' color='light' icon={chevronDownOutline} />
        </div>
    )
}

export default ProgramSelection