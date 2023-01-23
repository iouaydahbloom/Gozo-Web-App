import {SelectOption} from "../pages/Swap/SwapSelect/SwapSelect";

const mockReactSelect = ({
                             options,
                             value,
                             onChange
                         }: { options: SelectOption[], value: SelectOption, onChange: any }) => {
    function handleChange(event: any) {
        const option = options.find(
            option => option.value === event.currentTarget.value
        );
        onChange(option);
    }

    return (
        <select data-testid="select" value={value?.value} onChange={handleChange}>
            {options.map(({label, value}) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    );
}

export default mockReactSelect;