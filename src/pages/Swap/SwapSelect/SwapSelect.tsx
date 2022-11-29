import { IonAvatar, IonItem, IonLabel } from '@ionic/react';
import React from 'react'
import Select from 'react-select';
import styles from './swapSelect.module.scss'

export class SelectOption {
    constructor(
        public label: string,
        public value: string,
        public icon?: string
    ) { }
}

interface Props {
    label?: string,
    value?: string,
    onChange?: (value: string) => void,
    options?: SelectOption[],
    className?: string
}

const SwapSelect: React.FC<Props> = ({ label, value, onChange, options = [], className }) => {

    const customStyles: any = {
        menuPortal: (base: React.CSSProperties) => ({ ...base, zIndex: 9999 }),
        control: (base: React.CSSProperties, state: any) => ({
            ...base,
            border: 'none',
            boxShadow: 'none',
            background: "transparent",
            padding: "6px 0",
            height: '76px',
        }),
        placeholder: (defaultStyles: any) => {
            return {
                ...defaultStyles,
                color: 'var(--ion-color-light)',
            }
        },
        menu: (styles: React.CSSProperties, state: any) => {
            return {
                ...styles,
                background: 'var(--ion-color-dark-tint)',
                padding: 0,
                margin: 0,
                zIndex: '3',
                top: '90px',
                left: '-10px',
                borderRadius: '6px'
            };
        },
        option: (styles: React.CSSProperties, state: any) => {
            return {
                ...styles,
                background: state.isFocused ? 'var(--ion-color-medium)' : 'var(--ion-color-dark-tint)'
            };
        }
    }

    const formatOptionLabel = ({ value, label, icon }: any) => {
        return (
            <IonItem lines='none' className={styles.formatOptionLabel}>
                {icon &&
                    <IonAvatar>
                        <img
                            alt=''
                            src={icon}
                        />
                    </IonAvatar>
                }
                <IonLabel className={styles.optionLabel}>
                    {label}
                </IonLabel>
            </IonItem>
        );
    }

    return (
        <div>
            {label && <IonLabel color='light' className={styles.inputLabel}>{label}</IonLabel>}
            <Select
                styles={customStyles}
                value={options.find(opt => opt.value === value)}
                onChange={(event: any) => onChange && onChange(event.value ?? '')}
                options={options as any}
                className={className}
                isSearchable={false}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        neutral80: 'white'
                    }
                })}
                formatOptionLabel={formatOptionLabel}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        </div>
    )
}

export default SwapSelect;