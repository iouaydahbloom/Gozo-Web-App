import { InAppBrowser, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser";
import { isPlatform } from "@ionic/react";
import { useEffect } from "react";

const options: InAppBrowserOptions = {
    location: 'yes',
    hideurlbar: 'no',
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    presentationstyle: 'fullscreen',
    zoom: 'no',
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no',
    closebuttoncaption: 'Close',
    closebuttoncolor: '#5465FF',
    disallowoverscroll: 'no',
    toolbar: 'yes',
    enableViewportScale: 'no',
    allowInlineMediaPlayback: 'no',
    fullscreen: 'yes',
    footer: 'no',
    lefttoright: 'yes',
    usewkwebview: 'yes',
    hidespinner: 'no',
    toolbarposition: 'top',
    toolbarcolor: '#FFFFFF',
    hidenavigationbuttons: 'yes'
}

const useInAppBrowser = () => {
    useEffect(() => {
        if (isPlatform('mobileweb') || isPlatform('pwa')) return
        //@ts-ignore
        window.open = (url?: string | URL | undefined, target?: string | undefined, features?: string | undefined) => {
            InAppBrowser.create(url as any, target, options);
        }
    }, [])
}

export default useInAppBrowser;