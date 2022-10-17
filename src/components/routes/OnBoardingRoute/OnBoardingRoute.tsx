import { useContext } from "react";
import { Redirect } from "react-router";
import { AppRoutes } from "../../../constants/appRoutes";
import { OnBoardingPreviewContext } from "../../../providers/OnBoardingPreviewProvider/onBoardingPreviewContext";

interface IProps {
    children: React.ReactNode
}

const OnBoardingRoute: React.FC<IProps> = ({ children }) => {
    const { isHidden } = useContext(OnBoardingPreviewContext);

    if (isHidden) {
        return <Redirect to={AppRoutes.dashboard} />;
    }

    return children as React.ReactElement;
}

export default OnBoardingRoute