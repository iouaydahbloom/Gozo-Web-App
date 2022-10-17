import { OverlayEventDetail } from "@ionic/core";
import React, { ReactElement } from "react";
import useModal from "./useModal";

interface Options {
    title: string,
    component: React.FC<any> | ReactElement,
    componentProps?: any,
    initialBreakpoint?: number,
    id: string,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
}

const useSecondarySheet = (options: Options) => {

    const { showModal, dismissModal } = useModal({
        id: options.id,
        className: "secondary-sheet",
        onDismiss: options.onDismiss,
        initialBreakpoint: options.initialBreakpoint ? options.initialBreakpoint : 0.5,
        component: options.component
    });

    return {
        showModal,
        dismissModal
    }
}

export default useSecondarySheet;