import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { chainHex } from '../../helpers/networks';
import MoralisDappContext from './context';
import { ERC20Metadata } from '../../models/assets/ERC20Asset';

const MoralisDappProvider: React.FC = ({ children }) => {
  const { web3, user, isInitialized } = useMoralis();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [defaultTokenMetadata, setDefaultTokenMetadata] = useState<ERC20Metadata | null>(null);
  const Web3Api = useMoralisWeb3Api();

  useMemo(
    () => {
      setWalletAddress(
        //@ts-ignore
        web3?.provider?.selectedAddress || user?.get('ethAddress'),
      )
    }, [web3, user])

  const getDefaultTokenMetadata = useCallback(() => {
    const options = {
      chain: chainHex.Fuji,
      addresses: process.env.REACT_APP_TOKEN_CONTRACT
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

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId: chainHex.Fuji,
        defaultTokenMetadata: defaultTokenMetadata
      }}>
      {children}
    </MoralisDappContext.Provider>
  )
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error('useMoralisDapp must be used within a MoralisDappProvider');
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
