import {render, fireEvent, screen, waitFor} from "@testing-library/react";
import SwapPoints from "./SwapPoints";
import userEvent from "@testing-library/user-event";
import mockReactSelect from "../../../mocks/mockReactSelect";
import {SelectOption} from "../SwapSelect/SwapSelect";

jest.mock('../../../hooks/useLoyaltyPrograms')
jest.mock('../../../hooks/useAuthentication')
jest.mock('../../../hooks/useMembership')
jest.mock('../../../hooks/useProgramsExchange')
jest.mock("react-select", () => ({
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
});
describe('Swap Points', () => {

    beforeEach(async () => {
        await render(<SwapPoints/>)
    })

    it('Should load available balance after selected program change', () => {
        screen.getByText(/Available: 1000/);
    });

    it.todo('Should set not valid quantity if the quantity entered is less or equal to 0 or greater than the available balance', async () => {
        const fromSelect = screen.getAllByTestId('select')[0];
        const fromInput = screen.getAllByTestId('swap-input-testID')[0];
        screen.getByText(/Available: 1000/);
        fireEvent.change(fromInput, {target: {value: 1001}});
        // @ts-ignore
        expect(fromInput.value).toBe(1001);
        await waitFor(() => {
            expect(screen.getByTestId('swap-direction-testID')).toHaveStyle("width: 37px");
        })
    });

    it('Should enable the swap button if the quantity entered is between 0 and the available balance', async () => {
        const fromSelect = screen.getAllByTestId('select')[0];
        const fromInput = screen.getAllByTestId('swap-input-testID')[0];
        screen.getByText(/Available: 1000/);
        fireEvent.change(fromInput, {target: {value: 200}});
        // @ts-ignore
        expect(fromInput.value).toBe(200);
        await waitFor(() => {
            expect(screen.getByTestId('primary-button-testID')).not.toHaveAttribute('disabled')
        })
    })

    it.todo('Should show loader then show simulation in the "To" fields after typing and releasing in the "From" field');

    it.todo('Should show a success message after clicking on Swap that gives a successful result');

    it.todo('Should show an error message after clicking on Swap that throws an error');

    it('Should disable the switching button until the programs are loaded', () => {
        expect(screen.getByTestId('swap-direction-testID')).toHaveStyle("width: 37px");
    });

    it.todo('Should disable the switching button if it will lead to an empty option side');

    it.todo('Should switch between the two swap parties and select a default option if the switched option is not available in the side options');
})