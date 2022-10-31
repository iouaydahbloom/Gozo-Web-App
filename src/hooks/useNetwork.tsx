import { useIonModal } from "@ionic/react";
import { useContext, useEffect } from "react";
import PrimaryContainer from "../components/layout/PrimaryContainer/PrimaryContainer";
import PageStopper from "../components/sections/PageStopper/PageStopper";
import { networkContext } from "../providers/networkProvider/networkContext";

const NoNetworkConnection: React.FC = () => {
    return (
        <PrimaryContainer className='ion-text-center ion-padding' >
            <PageStopper
                title='OOPS! No Internet Connection'
                description='make sure wifi or cellular data is turned on'
                logoUrl='assets/image/no-internet.svg'
            />
        </PrimaryContainer>
    )
}

const useNetwork = () => {
    const { isOnline } = useContext(networkContext);
    const [show, hide] = useIonModal(NoNetworkConnection);

    useEffect(() => {
        isOnline ? hide() : show();
    }, [isOnline])

    return {
        isOnline
    }
}

export default useNetwork;