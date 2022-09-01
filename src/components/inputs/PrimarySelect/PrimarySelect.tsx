import { IonLabel } from '@ionic/react';
import React from 'react'
import Select from 'react-select';

export class SelectOption {
    constructor(public label: string,
        public value: string) { }
}

interface Props {
    label?: string,
    value?: string,
    onChange?: (value: string) => void,
    options?: SelectOption[]
}

const PrimarySelect: React.FC<Props> = ({ label, value, onChange, options = [] }) => {

    const customStyles: any = {
        menuPortal: (base: React.CSSProperties) => ({ ...base, zIndex: 9999 }),
        control: (base: React.CSSProperties, state: any) => ({
            ...base,
            border: 'none',
            boxShadow: 'none',
            background: "transparent",
            padding: "6px 0"
        }),
        placeholder: (defaultStyles: any) => {
            return {
                ...defaultStyles,
                color: '#ffffff',
            }
        }
    }

    return (
        <div>
            {label && <IonLabel color='light'>{label}</IonLabel>}
            <Select
                styles={customStyles}
                value={options.find(opt => opt.value == value)}
                onChange={(event: any) => onChange && onChange(event.value ?? '')}
                options={options as any}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        neutral80: 'white'
                    }
                })}
            />
        </div>
    )
}

export default PrimarySelect;