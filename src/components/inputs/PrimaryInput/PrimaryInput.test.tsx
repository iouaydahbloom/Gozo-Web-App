import { render } from "@testing-library/react"
import PrimaryInput from "./PrimaryInput";

test('should render component normaly', () => {
    render(<PrimaryInput
        value="1"
        onChange={(value) => console.log('value changes to ', value)}
    />);
})