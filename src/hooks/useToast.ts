import {ToastOptions, useIonToast} from '@ionic/react';
import {closeCircleOutline, informationCircleOutline, checkmarkCircleOutline} from 'ionicons/icons';

/**
 * The returned interface of useToast hook
 */
interface PresentationOptions {
    /**
     * A method to present an info message
     *
     * @param message - the presented message text
     */
    presentInfo: (message: string) => Promise<void>,
    /**
     * A method to present a success message
     *
     * @param message - the presented message text
     */
    presentSuccess: (message: string) => Promise<void>,
    /**
     * A method to present a failure message
     *
     * @param message - the presented message text
     */
    presentFailure: (message: string) => Promise<void>,
    /**
     * A method to dismiss the presented message
     */
    dismiss: () => Promise<void>
}

/**
 * Generic toast class
 */
const appToastClass = 'app-toaster';

/**
 * Custom hook that provide all toast messaging handlers
 *
 * @param duration - the duration of showing a message
 *
 * @returns PresentationOptions instance
 */
function useToast(duration?: number): PresentationOptions {

    const [present, dismiss] = useIonToast();
    const options: ToastOptions = {
        buttons: [{text: 'Ok', handler: () => dismiss()}],
        position: 'bottom',
        duration: duration ? duration : 3000
    }

    return {
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
}

export default useToast;