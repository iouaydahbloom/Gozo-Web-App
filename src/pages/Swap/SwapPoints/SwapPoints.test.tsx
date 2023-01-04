import { render, queryByAttribute, fireEvent } from "@testing-library/react";
import mockUseAuthentication from "../../../hooks/useAuthentication/useAuthentication.mock";
import mockUseLoyaltyPrograms from "../../../hooks/useLoyaltyPrograms/useLoyaltyPrograms.mock";
import mockUseMembership from "../../../hooks/useMembership/useMembership.mock";
import mockUseProgramsExchange from "../../../hooks/useProgramsExchange/useProgramsExchange.mock";
import SwapPoints from "./SwapPoints";

jest.mock('../../../hooks/useLoyaltyPrograms/useLoyaltyPrograms', () => mockUseLoyaltyPrograms)
jest.mock('../../../hooks/useAuthentication/useAuthentication', () => mockUseAuthentication)
jest.mock('../../../hooks/useMembership/useMembership', () => mockUseMembership)
jest.mock('../../../hooks/useProgramsExchange/useProgramsExchange', () => mockUseProgramsExchange)

describe('Swap Points', () => {

    it('Should render component normaly', () => {
        render(<SwapPoints />);
    })

    describe('Disable Swapping', () => {

        it('Should initialy disable swap button', async () => {
            const { findByText } = render(<SwapPoints />);
            const swapButton = await findByText('swap');
            expect(swapButton).toBeDisabled();
        })

        it('Should disable swap button if selected program quantity is not provided', async () => {
            const {findByText, findAllByRole, container} = render(<SwapPoints/>);

            const swapButton = await findByText('swap');

            const selections = await findAllByRole('combobox');
            const fromSelection = selections[0];
            fireEvent.change(fromSelection, {target: {value: 'GZL'}});
            const toSelection = selections[1];
            fireEvent.change(toSelection, {target: {value: 'GZL2'}});

            const getById = queryByAttribute.bind(null, 'id');
            const fromInput = getById(container, 'from')!;
            fireEvent.change(fromInput, {target: {value: '0'}});
            expect(swapButton).toBeDisabled();
        })

        it.todo('should disable swap button if selected program quantity is less then available balance')
    })

    it.todo('Should load available balance after selected program change')
    it.todo('Should show simulation after changing selected program quantity')
    it.todo('Should swap points successfuly and reduce available balance if swaping is enabled')
})