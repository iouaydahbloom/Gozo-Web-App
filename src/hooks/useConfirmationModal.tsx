import { modalController, OverlayEventDetail } from "@ionic/core";
import { useIonModal } from "@ionic/react";
import React, { ReactNode, useMemo } from "react";
import PrimaryModal from "../components/modals/PrimaryModal/PrimaryModal";
import useModal from "./useModal";

interface Options {
    title: string,
    component: React.FC<any>,
    componentProps?: any,
    id: string,
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
    comp?: ReactNode
}

const useConfirmationModal = (options: Options) => {
    // const { showModal: showSpinCondition } = useModal({
    //     component: SpinCondition,
    //     id: 'spinConditionModal',
    // });
    const ModalComponent = useMemo(() => {
        return (
            <>
                {
                    options.comp ?
                        options.comp
                        :
                        <PrimaryModal
                            title={options.title}
                            renderBody={() => (
                                <options.component {...options.componentProps} />
                            )}
                        />
                }
            </>
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

    function dismissModal(dismissData?: any) {
        modalController.dismiss(dismissData, undefined, options.id);
    }

    return {
        showModal,
        dismissModal
    }
}

export default useConfirmationModal;