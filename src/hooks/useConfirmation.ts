import { AlertButton, useIonAlert } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";

interface Options {
    title: string,
    message: string,
    customButtons?: AlertButton[],
    cssClass?: string,
    onConfirmed?: () => Promise<any>,
    onDeclined?: () => void,
    onDismiss?: (event?: CustomEvent<OverlayEventDetail<any>>) => void
}

const useConfirmation = () => {
    const [present] = useIonAlert();

    const showAlert = (options: Options) : Promise<any> => {
        return new Promise(async (resolve, reject) => {
            await present({
                cssClass: `app-confirmation-alert ${options.cssClass}`,
                header: options.title,
                message: options.message,
                mode: 'ios',
                buttons: options.customButtons && options.customButtons.length > 0 ? options.customButtons : [
                    {
                        text: 'NO',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            options.onDeclined && options.onDeclined();
                            options.onDismiss && options.onDismiss();
                            resolve(false);
                        },
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            options.onConfirmed &&
                            options.onConfirmed()
                                .then(() => {
                                resolve(true)
                            });
                            options.onDismiss && options.onDismiss();
                        },
                    },
                ],
                onDidDismiss: options.onDismiss
            })
        })
    }

    return {
        confirm: showAlert
    }
}

export default useConfirmation;