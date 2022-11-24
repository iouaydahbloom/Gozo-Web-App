import { ToastOptions, useIonToast } from '@ionic/react';
import { closeCircleOutline, informationCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

interface PresentingOptions {
    presentInfo: (message: string) => Promise<void>,
    presentSuccess: (message: string) => Promise<void>,
    presentFailure: (message: string) => Promise<void>,
    dismiss: () => Promise<void>
}

const appToastClass = 'app-toaster';

function useToast(duration?: number): PresentingOptions {

    const [present, dismiss] = useIonToast();
    const options: ToastOptions = {
        buttons: [{ text: 'Ok', handler: () => dismiss() }],
        position: 'bottom',
        duration: duration ? duration : 3000
    }

    const toast: PresentingOptions = {
        presentInfo: (message: string) => {
            options.cssClass = [appToastClass, 'info'];
            options.message = message;
            options.icon = informationCircleOutline;
            return present(options)
        },
        presentSuccess: (message: string) => {
            options.cssClass = [appToastClass, 'success'];
            options.message = message;
            options.icon = checkmarkCircleOutline;
            return present(options)
        },
        presentFailure: (message: string) => {
            options.cssClass = [appToastClass, 'failure'];
            options.message = message;
            options.icon = closeCircleOutline;
            return present(options)
        },
        dismiss
    }

    return toast;
}

export default useToast;