import { Geolocation } from '@capacitor/geolocation';

async function getCurrentGeoPosition() {
    return Geolocation.getCurrentPosition();
}

export {
    getCurrentGeoPosition
}