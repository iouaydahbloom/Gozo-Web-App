import React, { useCallback, useEffect, useState } from 'react';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { chainHex } from '../../helpers/networks';
import MoralisDappContext from './dappContext';
import { ERC20Metadata } from '../../models/assets/ERC20Asset';
import { appConfig } from '../../constants/appConfig';
import useAuthentication from '../../hooks/useAuthentication';
import dapContext from './dappContext';

const DappProvider: React.FC = ({ children }) => {
  const { isInitialized } = useMoralis();
  const { user } = useAuthentication();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [defaultTokenMetadata, setDefaultTokenMetadata] = useState<ERC20Metadata | null>(null);
  const Web3Api = useMoralisWeb3Api();

  const getDefaultTokenMetadata = useCallback(() => {
    const options = {
      chain: chainHex.Fuji,
      addresses: appConfig.tokenContract
    };
    Web3Api.token
      .getTokenMetadata(options as any)
      .then(tokens => {
        if (tokens && tokens[0]) {
          setDefaultTokenMetadata(tokens[0]);
        }
      })
      .catch(error => {
        console.log('Error: get default token metadata ', error);
      })
  }, [])

  useEffect(() => {
    if (isInitialized) {
      getDefaultTokenMetadata();
    }
  }, [isInitialized])

  useEffect(() => {
    setWalletAddress(user?.walletAddress ?? null)
  }, [user?.walletAddress])

  return (
    <dapContext.Provider
      value={{
        walletAddress,
        chainId: chainHex.Fuji,
        defaultTokenMetadata: defaultTokenMetadata
      }}>
      {children}
    </dapContext.Provider>
  )
}

function useDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error('useDapp must be used within a DappProvider');
  }
  return context;
}

export { DappProvider, useDapp };
