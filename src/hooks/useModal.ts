import { modalController, OverlayEventDetail } from "@ionic/core";
import { useIonModal } from "@ionic/react";

interface Options {
    component: any,
    ComponentProps?: any,
    id: string,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void
}

const useModal = (options: Options) => {
    const [presentIonicModal] = useIonModal(options.component, options.ComponentProps);

    function showModal() {
        presentIonicModal({
            cssClass: 'gozo-modal',
            id: options.id,
            //initialBreakpoint: 0.90,
            // breakpoints: [0.90],
            onDidDismiss: options.onDismiss,
            
        })
    }

    function dismissModal(dismissData: any) {
        modalController.dismiss(dismissData, undefined, options.id);
    }

    return {
        showModal,
        dismissModal
    }
}

export default useModal;