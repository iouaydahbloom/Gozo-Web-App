import {render, screen} from "@testing-library/react";
import PrimaryTypography from "./PrimaryTypography";

describe('PrimaryTypography', () => {
    it('Should render the passed children on screen', () => {
        render(
            <PrimaryTypography>
                A text just to test the typography component.
            </PrimaryTypography>
        )

        expect(screen.getByText('A text just to test the typography component.')).toBeInTheDocument()
    })
})