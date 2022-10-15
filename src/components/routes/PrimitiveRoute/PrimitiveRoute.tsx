import { useContext } from "react";
import { Redirect } from "react-router";
import { AppRoutes } from "../../../constants/appRoutes";
import { HideScreenContext, IHideScreen } from "../../../providers/HideScreenProvider/HideScreenProvider.context";

interface IProps {
    children: React.ReactNode
}

const PrimitiveRoute: React.FC<IProps> = ({ children }) => {
    const { hideScreen } = useContext(HideScreenContext) as IHideScreen;

    if (hideScreen) {
        return <Redirect to={AppRoutes.dashboard} />;
    }

    return children as React.ReactElement;
}

export default PrimitiveRoute