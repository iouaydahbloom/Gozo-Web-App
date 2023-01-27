// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';

import {BarcodeScanner} from "@capacitor-community/barcode-scanner";

const useBarcodeScanner = () => {

    async function scan() {
        //@ts-ignore
        document.querySelector('body').classList.add('scanner-active');
        // return BarcodeScanner.scan()
        await BarcodeScanner.checkPermission({force: true});

        // make background of WebView transparent
        // note: if you are using ionic this might not be enough, check below
        await BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

        //@ts-ignore
        document.querySelector('body').classList.remove('scanner-active');
        // if the result has content
        if (result.hasContent) {
            console.log(result.content); // log the raw scanned content
            return {text: result.content!};
        }

        return {text: ''};
    }

    return {
        scan
    }
}

export default useBarcodeScanner;