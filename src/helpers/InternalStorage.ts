import { Storage } from '@capacitor/storage';

export default class InternalStorage {

    static async setInStorage(key: string, value: any): Promise<any> {
        let stringifiedValue = JSON.stringify(value);
        return Storage.set({ key, value: stringifiedValue });
    }

    static async getFromStorage<T>(key: string): Promise<T> {
        const result = await Storage.get({ key });
        return result && result.value ? JSON.parse(result.value) : null;
    }

    static async removeFromStorage(key: string): Promise<any> {
        return Storage.remove({ key });
    }

    static async removeMultipleFromStorage(keys: string[]): Promise<any> {
        return keys && keys?.forEach((key: string) => {
            return Storage.remove({ key });
        })
    }

    static async clearStorage() {
        await Storage.clear();
    }
}

