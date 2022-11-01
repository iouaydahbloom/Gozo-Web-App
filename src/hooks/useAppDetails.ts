import { App } from '@capacitor/app';
import { useEffect, useState } from 'react';

const defaultVersion = '1.0';

const useAppDetails = () => {

    const [appVersion, setAppVersion] = useState<string>(defaultVersion);

    async function getInfo() {
        try {
            const appInfo = await App.getInfo();
            setAppVersion(appInfo.version);
        }
        catch (error) {
            setAppVersion(defaultVersion)
        }
    }

    useEffect(() => {
        getInfo();
    }, [])

    return {
        appVersion
    }
}

export default useAppDetails;