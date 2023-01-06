import {render, queryByAttribute, fireEvent} from "@testing-library/react";
import mockUseAuthentication from "../../../hooks/useAuthentication/useAuthentication.mock";
import mockUseLoyaltyPrograms from "../../../hooks/useLoyaltyPrograms/useLoyaltyPrograms.mock";
import mockUseMembership from "../../../hooks/useMembership/useMembership.mock";
import mockUseProgramsExchange from "../../../hooks/useProgramsExchange/useProgramsExchange.mock";
import SwapPoints from "./SwapPoints";
import useProgramsExchange from "../../../hooks/useProgramsExchange/useProgramsExchange";

// jest.mock('../../../hooks/useLoyaltyPrograms/useLoyaltyPrograms', () => mockUseLoyaltyPrograms)
// jest.mock('../../../hooks/useAuthentication/useAuthentication', () => mockUseAuthentication)
// jest.mock('../../../hooks/useMembership/useMembership', () => mockUseMembership)
// jest.mock('../../../hooks/useProgramsExchange/useProgramsExchange', () => mockUseProgramsExchange)

// jest.spyOn(useProgramsExchange, '').mockImplementation(() => {
//     return {
//         exchange: jest.fn(),
//         exchangeInOptions: [],
//         exchangeOutOptions: [],
//         defaultExchangeOptions: null,
//         originProgram: null,
//         setOriginProgram: jest.fn(),
//         destinationProgram: null,
//         setDestinationProgram: jest.fn(),
//         exchanging: false,
//         simulating: false,
//         direction: 'p2s',
//         isDisabled: true,
//         toggleDirection: jest.fn(),
//         originBalance: 1000
//     }
// })

describe('Swap Points', () => {


    // describe('Disable Swapping', () => {
    //     it('Should disable swap button if selected program quantity is not provided', async () => {
    //         const {findByText, findAllByRole, container} = render(<SwapPoints/>);
    //
    //         const swapButton = await findByText('swap');
    //
    //         const selections = await findAllByRole('combobox');
    //         const fromSelection = selections[0];
    //         fireEvent.change(fromSelection, {target: {value: 'GZL'}});
    //         const toSelection = selections[1];
    //         fireEvent.change(toSelection, {target: {value: 'GZL2'}});
    //
    //         const getById = queryByAttribute.bind(null, 'id');
    //         const fromInput = getById(container, 'from')!;
    //         fireEvent.change(fromInput, {target: {value: '0'}});
    //         expect(swapButton).toBeDisabled();
    //     })
    //
    // })

    it('Should render component normally', () => {
        render(<SwapPoints/>);
    })

    it.todo('Should set not valid quantity if the quantity entered is less or equal to 0 or greater than the available balance');
    it.todo('Should disable the swap button if the quantity entered is less or equal to 0 or greater than the available balance');
    it.todo('Should disable the swap button if the "To" side is not selected');
    it.todo('Should load available balance after selected program change');
    it.todo('Should show loader then show simulation in the "To" fields after typing and releasing in the "From" field');
    it.todo('Should show a success message after clicking on Swap that gives a successful result');
    it.todo('Should show an error message after clicking on Swap that throws an error');
    it.todo('Should disable the switching button until the programs are loaded');
    it.todo('Should disable the switching button if it will lead to an empty option side');
    it.todo('Should switch between the two swap parties and select a default option if the switched option is not available in the side options');
})