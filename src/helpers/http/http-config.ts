import axios from 'axios';
import axiosRetry from 'axios-retry';
import { appConfig } from '../../constants/appConfig';

const TIME_OUT_CODE = 'ECONNABORTED';

class HttpError {
    constructor(
        public status: number | string,
        public message: string,
        public errors: any
    ) { }
}

const http = axios.create({
    baseURL: appConfig.moralisServerUrl,
    timeout: 1000,
    timeoutErrorMessage: 'Network Connection Issue'
});

axiosRetry(http, {
    retries: 2,
    shouldResetTimeout: true,
    retryCondition: (error) => {
        return error.code === TIME_OUT_CODE;
    }
});

http.interceptors.response.use(
    (response) => response.data.result,
    async (error) => {
        const errorResponse = error.response;
        if (!errorResponse) return Promise.reject(new HttpError(TIME_OUT_CODE, error.message, null));
        const message = typeof errorResponse.data.error == 'string' ? errorResponse.data.error : '';
        const errors = typeof errorResponse.data.error == 'object' ? errorResponse.data.error : null;
        return Promise.reject(new HttpError(errorResponse.status, message, errors));
    });

export { http };
