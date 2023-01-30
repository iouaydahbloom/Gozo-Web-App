import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import CurrencySettingsProvider from './providers/CurrencySettingsProvider/CurrencySettingsProvider';
import MagicAuthProvider from './providers/MagicAuthProvider/MagicAuthProvider';
import SessionProvider from './providers/SessionProvider/SessionProvider';
import {DappProvider} from './providers/DappProvider/DappProvider';
import OnBoardingPreviewProvider from './providers/OnBoardingPreviewProvider/OnBoardingPreviewProvider';
import NetworkProvider from './providers/networkProvider/NetworkProvider';
import WheelSettingsProvider from './providers/WheelSettingsProvider/WheelSettingsProvider';
import {ErrorHandlerProvider} from './providers/ErrorHandlerProvider/ErrorHandlerProvider';
import {QueryClient, QueryClientProvider} from "react-query";
import CameraCloseButton from "./components/camera/CameraCloseButton";

require('dotenv').config();

ReactDOM.render(
    <React.StrictMode>
        <>
            <CameraCloseButton/>
            <ErrorHandlerProvider>
                <NetworkProvider>
                    <OnBoardingPreviewProvider>
                        <MagicAuthProvider>
                            <QueryClientProvider client={new QueryClient()}>
                                <SessionProvider>
                                    <DappProvider>
                                        <CurrencySettingsProvider>
                                            <WheelSettingsProvider>
                                                <App/>
                                            </WheelSettingsProvider>
                                        </CurrencySettingsProvider>
                                    </DappProvider>
                                </SessionProvider>
                            </QueryClientProvider>
                        </MagicAuthProvider>
                    </OnBoardingPreviewProvider>
                </NetworkProvider>
            </ErrorHandlerProvider>
        </>

    </React.StrictMode>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();
//serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
