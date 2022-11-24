import axios from 'axios';
import axiosRetry from 'axios-retry';
import { appConfig } from '../../constants/appConfig';

export const TIME_OUT_CODE = 'ECONNABORTED';

class HttpError extends Error {
    constructor(
        public code: number | string,
        public message: string,
        public errors: any
    ) {
        super(message);
        // 👇️ because we are extending a built-in class
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

const http = axios.create({
    baseURL: appConfig.moralisServerUrl,
    timeout: 100,
    timeoutErrorMessage: 'Network Connection Issue'
});

axiosRetry(http, {
    retries: 1,
    shouldResetTimeout: true,
    retryCondition: (error) => {
        return error.code === TIME_OUT_CODE;
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
