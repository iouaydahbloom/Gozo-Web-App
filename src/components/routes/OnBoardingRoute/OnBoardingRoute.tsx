import { useContext } from "react";
import { Redirect } from "react-router";
import { AppRoutes } from "../../../constants/appRoutes";
import { IHideOnBoarding, OnBoardingPreviewContext } from "../../../providers/OnBoardingPreviewProvider/OnBoardingPreviewProvider.context";

interface IProps {
    children: React.ReactNode
}

const OnBoardingRoute: React.FC<IProps> = ({ children }) => {
    const { hideOnBoarding } = useContext(OnBoardingPreviewContext) as IHideOnBoarding;
console.log("hideOnBoarding", hideOnBoarding)
    if (hideOnBoarding) {
        return <Redirect to={AppRoutes.dashboard} />;
    }

    return children as React.ReactElement;
}

export default OnBoardingRoute