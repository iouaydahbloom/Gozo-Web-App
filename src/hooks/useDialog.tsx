import { OverlayEventDetail } from "@ionic/core";
import React, { ReactElement } from "react";
import useModal from "./useModal";

interface Options {
    id: string,
    component: React.FC<any> | ReactElement,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
}

const useDialog = (options: Options) => {

    const { showModal, dismissModal } = useModal({
        id: options.id,
        className: "primary-dialog",
        onDismiss: options.onDismiss,
        component: options.component
    });

    return {
        showModal,
        dismissModal
    }
}

export default useDialog;