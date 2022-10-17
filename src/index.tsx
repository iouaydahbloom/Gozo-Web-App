import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
import CurrencySettingsProvider from './providers/CurrencySettingsProvider/CurrencySettingsProvider';
import { appConfig } from './constants/appConfig';
import MagicAuthProvider from './providers/MagicAuthProvider/MagicAuthProvider';
import SessionProvider from './providers/SessionProvider/SessionProvider';
import { DappProvider } from './providers/DappProvider/DappProvider';
import OnBoardingPreviewProvider from './providers/OnBoardingPreviewProvider/OnBoardingPreviewProvider';
require('dotenv').config();

ReactDOM.render(
  <React.StrictMode>
    <OnBoardingPreviewProvider>
      <MoralisProvider
        appId={appConfig.moralisAppId}
        serverUrl={appConfig.moralisServerUrl}>
        <MagicAuthProvider>
          <SessionProvider>
            <DappProvider>
              <CurrencySettingsProvider>
                <App />
              </CurrencySettingsProvider>
            </DappProvider>
          </SessionProvider>
        </MagicAuthProvider>
      </MoralisProvider>
    </OnBoardingPreviewProvider>
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
