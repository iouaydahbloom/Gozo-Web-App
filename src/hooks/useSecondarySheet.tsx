import { OverlayEventDetail } from "@ionic/core";
import React, { ReactElement } from "react";
import useModal from "./useModal";

/**
 * useSecondarySheet Options
 */
interface Options {
    /**
     * The title of the sheet
     */
    title: string,
    /**
     * The component to render
     */
    component: React.FC<any> | ReactElement,
    /**
     * The props associated with the component
     */
    componentProps?: any,
    /**
     * The point in px that the sheet will break on
     *
     */
    initialBreakpoint?: number,
    /**
     * The unique ID of the sheet
     */
    id: string,
    /**
     * A Callback to be called after dismissing the sheet
     *
     * @param event - data passed to the callback
     */
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
}

/**
 * Custom hook that provides some sheet handlers
 *
 * @param options - the options to create a new sheet
 *
 * @returns object
 */
const useSecondarySheet = (options: Options) => {

    const { showModal, dismissModal } = useModal({
        id: options.id,
        className: "secondary-sheet",
        onDismiss: options.onDismiss,
        initialBreakpoint: options.initialBreakpoint ? options.initialBreakpoint : 0.5,
        component: options.component
    });

    return {
        /**
         * Show the sheet
         */
        showModal,
        /**
         * Dismiss the sheet
         */
        dismissModal
    }
}

export default useSecondarySheet;