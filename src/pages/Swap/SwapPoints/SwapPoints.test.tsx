import {render, fireEvent, screen, waitFor} from "@testing-library/react";
import SwapPoints from "./SwapPoints";
import {SelectOption} from "../SwapSelect/SwapSelect";
import userEvent from '@testing-library/user-event';
import {useMemo} from "react";
import {UserLoyaltyProgram, UserLoyaltyProgramCurrency} from "../../../models/loyaltyProgram";
import {DynamicInputIdentifier} from "../../../models/dynamicInputIdentifier";
import {Redemption} from "../../../models/redemption";
import * as useLoyaltyPrograms from "../../../hooks/loyaltyProgram/useLoyaltyPrograms";

jest.mock('../../../hooks/loyaltyProgram/useLoyaltyPrograms')
jest.mock('../../../hooks/useAuthentication')
jest.mock('../../../hooks/membership/useMembership')
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

    it('Should load available balance after selected program change', async () => {
        await waitFor(() => {
            screen.getByText(/Available: 1000/);
        })
    });

    describe('Enable/Disable swapping', () => {

        it('Should enable the swap button if the quantity entered is between 0 and the available balance', async () => {
            const fromInput = screen.getAllByTestId('swap-input-testID')[0];
            screen.getByText(/Available: 1000/);
            fireEvent.change(fromInput, {target: {value: 200}});
            expect((fromInput as HTMLInputElement).value).toBe(200);
            await waitFor(() => {
                expect(screen.getByTestId('primary-button-testID')).toHaveAttribute('disabled', 'false')
            })
        })

        it('Should disable the swap button if the quantity entered is more than the available balance', async () => {
            const fromInput = screen.getAllByTestId('swap-input-testID')[0];
            screen.getByText(/Available: 1000/);
            fireEvent.change(fromInput, {target: {value: 1001}});
            expect((fromInput as HTMLInputElement).value).toBe(1001);
            await waitFor(() => {
                expect(screen.getByTestId('primary-button-testID')).toHaveAttribute('disabled', 'true')
            })
        })

        it('Should disable the swap button if the quantity entered is 0 or null', async () => {
            const fromInput = screen.getAllByTestId('swap-input-testID')[0];
            screen.getByText(/Available: 1000/);
            fireEvent.change(fromInput, {target: {value: 0}});
            expect((fromInput as HTMLInputElement).value).toBe(0);
            await waitFor(() => {
                expect(screen.getByTestId('primary-button-testID')).toHaveAttribute('disabled', 'true')
            })
        })
    })

    describe('Changing swap directions', () => {

        it('It should enable changing directions', () => {
            const swapDirectionButton = screen.getByTestId('swap-direction-testID')
            expect(swapDirectionButton).toBeInTheDocument()
        })

        it('Change programs after clicking on swap icon', async () => {
            const swapDirectionButton = screen.getByTestId('swap-direction-testID')
            expect(swapDirectionButton).toBeInTheDocument();

            const fromSelect = screen.getAllByTestId('select')[0];
            const previousFromValue = (fromSelect as HTMLSelectElement).value;
            const toSelect = screen.getAllByTestId('select')[1];
            const previousToValue = (toSelect as HTMLSelectElement).value;

            userEvent.click(swapDirectionButton);

            await waitFor(() => {
                expect((fromSelect as HTMLSelectElement).value).not.toBe(previousFromValue);
                expect((toSelect as HTMLSelectElement).value).not.toBe(previousToValue);
            })
        })

        it('Should disable the switching button until the programs are loaded', async () => {
            const swapDirectionButton = screen.getByTestId('swap-direction-testID')
            expect(swapDirectionButton).toBeInTheDocument();
            expect(swapDirectionButton).toHaveAttribute('aria-disabled', 'false');
        });

        it('Should disable the switching button if it will lead to an empty option side', async () => {

            jest.spyOn(useLoyaltyPrograms, 'default')
                .mockImplementation(() => ({
                        ...jest.requireActual('../../../hooks/loyaltyProgram/useLoyaltyPrograms'),
                        defaultProgram: new UserLoyaltyProgram(
                            new UserLoyaltyProgramCurrency(
                                'GZL',
                                'Super Points',
                                'GOZO',
                                new Date(),
                                '1',
                                '1',
                                'logo',
                                false,
                                false,
                                false,
                                false
                            ),
                            '1',
                            [],
                            new Date(),
                            '1',
                            '1',
                            new Redemption(600, false)
                        )
                    })
                )

            const swapDirectionButton = screen.getByTestId('swap-direction-testID');
            expect(swapDirectionButton).toHaveAttribute('aria-disabled', 'true');
        });
    })

    describe('Simulating', () => {

        it('Should show loader then show simulation in the "To" fields after typing and releasing in the "From" field', async () => {
            const fromInput = screen.getAllByTestId('swap-input-testID')[0];
            screen.getByText(/Available: 1000/);
            fireEvent.change(fromInput, {target: {value: 200}});
            expect((fromInput as HTMLInputElement).value).toBe(200);
            await waitFor(() => {
                expect(screen.getByTestId('primary-button-testID')).toHaveAttribute('disabled', 'false')
            })
            const toInput = screen.getAllByTestId('swap-input-testID')[1];
            await waitFor(() => {
                expect((toInput as HTMLInputElement).value).toBe(2000);
            })
        })

    })

    describe('Swapping', () => {
        it.todo('Should show a success message after clicking on Swap that gives a successful result');
        it.todo('Should show an error message after clicking on Swap that throws an error');
        it.todo('Should reduce the origin balance after a successful result');
    })
})