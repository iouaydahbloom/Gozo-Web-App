import {BarcodeScanner} from "@capacitor-community/barcode-scanner";
import {useEffect} from "react";

const useBarcodeScanner = () => {

    function showBarcodeScanner() {
        document.querySelector('body')?.classList.add('scanner-active');
    }

    function hideBarcodeScanner() {
        document.querySelector('body')?.classList.remove('scanner-active');
    }

    async function stopScanning() {
        hideBarcodeScanner();
        await BarcodeScanner.showBackground();
        await BarcodeScanner.stopScan();
    }

    async function scan() {
        showBarcodeScanner();
        await BarcodeScanner.checkPermission({force: true});
        await BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan();

        hideBarcodeScanner();
        if (result.hasContent) {
            return {text: result.content!};
        }
        return {text: ''};
    }

    useEffect(() => {
        const registerHighPriorityScannerAction = (ev: any) => {
            ev.detail.register(1000000, async () => {
                await stopScanning();
            })
        }
        document.addEventListener('ionBackButton', registerHighPriorityScannerAction);
        return () => {
            document.removeEventListener('ionBackButton', registerHighPriorityScannerAction);
        }
    }, [])

    return {
        scan,
        stopScanning
    }
}

export default useBarcodeScanner;