import { modalController, OverlayEventDetail } from "@ionic/core";
import { useIonModal } from "@ionic/react";
import React, { ReactElement, useMemo } from "react";

interface Options {
    id: string,
    component: React.FC<any> | ReactElement,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
    initialBreakpoint?: number,
    className?: string
}

const useModal = (options: Options) => {
    const [presentIonicModal] = useIonModal(options.component);

    function showModal() {
        presentIonicModal({
            cssClass: options.className,
            id: options.id,
            onDidDismiss: options.onDismiss,
            initialBreakpoint: options.initialBreakpoint,
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