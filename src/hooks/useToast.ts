import { ToastOptions, useIonToast } from '@ionic/react';
import { closeCircleOutline, informationCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

interface PresentingOptions {
    presentInfo: (message: string) => Promise<void>,
    presentSuccess: (message: string) => Promise<void>,
    presentFailure: (message: string) => Promise<void>,
    dismiss: () => Promise<void>
}

const appToasterClass = 'app-toaster';

function useToast(): PresentingOptions {

    const [present, dismiss] = useIonToast();
    const options: ToastOptions = {
        buttons: [{ text: 'Ok', handler: () => dismiss() }],
        position: 'top',
        duration: 3000
    }

    const toaster: PresentingOptions = {
        presentInfo: (message: string) => {
            options.cssClass = [appToasterClass, 'info'];
            options.message = message;
            options.icon = informationCircleOutline;
            return present(options)
        },
        presentSuccess: (message: string) => {
            options.cssClass = [appToasterClass, 'success'];
            options.message = message;
            options.icon = checkmarkCircleOutline;
            return present(options)
        },
        presentFailure: (message: string) => {
            options.cssClass = [appToasterClass, 'failure'];
            options.message = message;
            options.icon = closeCircleOutline;
            return present(options)
        },
        dismiss
    }

    return toaster;
}

export default useToast;