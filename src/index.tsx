import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
import { MoralisDappProvider } from './providers/MoralisDappProvider/MoralisDappProvider';
import CurrencySettingsProvider from './providers/CurrencySettingsProvider/CurrencySettingsProvider';
require('dotenv').config();

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_APPLICATION_ID ?? ''}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL ?? ''}>
      <MoralisDappProvider>
        <CurrencySettingsProvider>
          <App />
        </CurrencySettingsProvider>
      </MoralisDappProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
