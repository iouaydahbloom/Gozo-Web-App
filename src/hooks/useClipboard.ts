import { Clipboard } from '@awesome-cordova-plugins/clipboard';

const useClipboard = () => {

    function copy(text: string) {
        Clipboard.copy(text)
    }

    return {
        copy
    }
}

export default useClipboard;