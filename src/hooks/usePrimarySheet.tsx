import { OverlayEventDetail } from "@ionic/core";
import React from "react";
import PrimaryModal from "../components/modals/PrimaryModal/PrimaryModal";
import useModal from "./useModal";

interface Options {
    title: string,
    component: React.FC<any>,
    componentProps?: any,
    initialBreakpoint?: number,
    id: string,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
}

const usePrimarySheet = (options: Options) => {

    const { showModal, dismissModal } = useModal({
        id: options.id,
        className: "primary-sheet",
        onDismiss: options.onDismiss,
        initialBreakpoint: options.initialBreakpoint ? options.initialBreakpoint : 0.9,
        component: <PrimaryModal
            title={options.title}
            renderBody={() => (
                <options.component {...options.componentProps} />
            )}
        />
    });

    return {
        showModal,
        dismissModal
    }
}

export default usePrimarySheet;