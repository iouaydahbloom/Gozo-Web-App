import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';

const useBarcodeScanner = () => {

    async function scan() {
        return BarcodeScanner.scan()
    }

    return {
        scan
    }
}

export default useBarcodeScanner;