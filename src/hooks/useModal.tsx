import { modalController, OverlayEventDetail } from "@ionic/core";
import { useIonModal } from "@ionic/react";
import React, { useMemo } from "react";
import PrimaryModal from "../components/modals/PrimaryModal/PrimaryModal";

interface Options {
    title: string,
    component: React.FC<any>,
    componentProps?: any,
    id: string,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void
}

const useModal = (options: Options) => {

    const ModalComponent = useMemo(() => {
        return (
            <PrimaryModal
                title={options.title}
                renderBody={() => (
                    <options.component {...options.componentProps} />
                )}
            />
        )
    }, [options.component, options.componentProps])

    const [presentIonicModal] = useIonModal(ModalComponent);

    function showModal() {
        presentIonicModal({
            cssClass: 'gozo-modal',
            id: options.id,
            //initialBreakpoint: 0.90,
            // breakpoints: [0.90],
            onDidDismiss: options.onDismiss,

        })
    }

    async function dismissModal(dismissData?: any) {
        const topModal = await modalController.getTop();
        if (!!topModal) {
            modalController.dismiss(dismissData, undefined, options.id);
        }
    }

    return {
        showModal,
        dismissModal
    }
}

export default useModal;