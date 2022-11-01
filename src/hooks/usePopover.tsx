import { OverlayEventDetail } from "@ionic/core";
import { ReactElement } from "react";
import { IonContent, useIonPopover } from '@ionic/react';

interface Options {
    id: string,
    content: string | ReactElement
    onDismiss?: (event: (CustomEvent<OverlayEventDetail<any>>)) => void,
    className?: string
}

const usePopover = (options: Options) => {

    const Popover = () => <IonContent className="ion-padding">{options.content}</IonContent>;

    const [present, dismiss] = useIonPopover(Popover);

    function showPopover(event:Event) {
        present({
            event: event,
            cssClass: options.className,
            id: options.id,
            onDidDismiss: options.onDismiss,
            mode: 'ios'
            
        })
    }

    return {
        showPopover,
        dismissPopover: dismiss
    }
}

export default usePopover;