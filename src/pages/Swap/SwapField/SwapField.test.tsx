import {render, screen} from "@testing-library/react";
import SwapField from "./SwapField";
import {SelectOption} from "../SwapSelect/SwapSelect";

describe('Selecting option with availability option turned on', () => {

    it('Should show the availability when it is passed to the component', () => {
        const options: SelectOption[] = [
            new SelectOption('GOZO', '1'),
            new SelectOption('Avalanche', '2'),
            new SelectOption('Bitcoin', '3'),
            new SelectOption('Ethereum', '4'),
        ]
        render(
            <SwapField
                label='SwapField testing label'
                selectedOption={'1'}
                options={options}
                withAvailability={true}
                availability={12}
            />
        )

        expect(screen.getByText(/Available: 12/)).toBeInTheDocument();
    })
})