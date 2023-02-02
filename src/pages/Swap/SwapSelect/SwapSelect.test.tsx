import {render, screen} from "@testing-library/react";
import SwapSelect, {SelectOption} from "./SwapSelect";
import userEvent from "@testing-library/user-event";

jest.mock("react-select", () =>
    ({options, value, onChange}: { options: SelectOption[], value: SelectOption, onChange: any }) => {
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
    })

describe('Swap Select Control', () => {

    it('Should show the label of the dropdown', () => {
        render(<SwapSelect
            label='Testing Swap Select'
            value={'1'}
            onChange={() => null}
            options={[]}
        />)

        expect(screen.getByText('Testing Swap Select')).toBeInTheDocument();
    })

    it('Should call onChange function on each option selection', async () => {
        const options: SelectOption[] = [
            new SelectOption('GOZO', '1'),
            new SelectOption('Avalanche', '2'),
            new SelectOption('Bitcoin', '3'),
            new SelectOption('Ethereum', '4'),
        ]

        const onSelectChange = jest.fn();

        render(<SwapSelect
            label='Testing Swap Select'
            value='1'
            onChange={onSelectChange}
            options={options}
        />)

        const select = screen.getByTestId('select');
        userEvent.selectOptions(select, ['2']);
        expect(onSelectChange).toBeCalledTimes(1);
        expect(onSelectChange).toHaveBeenCalledWith('2');
    })
})