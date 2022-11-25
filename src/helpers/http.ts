import axios from 'axios';
import axiosRetry from 'axios-retry';
import { appConfig } from '../constants/appConfig';
import { networkResponseCode } from '../constants/networkResponseCode';

class HttpError extends Error {
    constructor(
        public code: number | string,
        public message: string,
        public errors: any
    ) {
        super(message);
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

const http = axios.create({
    baseURL: appConfig.moralisServerUrl,
    timeout: 15000,
    timeoutErrorMessage: 'Network Connection Issue'
});

axiosRetry(http, {
    retries: 1,
    shouldResetTimeout: true,
    retryCondition: (error) => {
        return error.code === networkResponseCode.timeOut;
    }
});

http.interceptors.response.use(
    (response) => response.data.result,
    async (error) => {
        const errorResponse = error.response;
        if (!errorResponse) throw (new HttpError(error.code, error.message, null));
        const message = typeof errorResponse.data.error == 'string' ? errorResponse.data.error : '';
        const errors = typeof errorResponse.data.error == 'object' ? errorResponse.data.error : null;
        throw (new HttpError(errorResponse.status, message, errors));
    });

export { http };
