import React, { useCallback, useEffect, useState } from 'react';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';
import { chainHex } from '../../helpers/networks';
import MoralisDappContext, { ContractsMetadata } from './dappContext';
import { ERC20Metadata } from '../../models/assets/ERC20Asset';
import useAuthentication from '../../hooks/useAuthentication';
import dapContext from './dappContext';
import useCloud from '../../hooks/useCloud';
import { cloudFunctionName } from '../../moralis/cloudFunctionName';

const DappProvider: React.FC = ({ children }) => {
  const { isInitialized } = useMoralis();
  const { user } = useAuthentication();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [defaultTokenMetadata, setDefaultTokenMetadata] = useState<ERC20Metadata | null>(null);
  const Web3Api = useMoralisWeb3Api();
  const [isReady, setIsReady] = useState(false);
  const [contractsMetadata, setContractsMetadata] = useState<ContractsMetadata>({
    tokenContractAddress: '',
    gameContractAddress: '',
    relayerContractAddress: '',
    forwarderContractAddress: '',
    tokenContractAbi: [],
    gameContractAbi: [],
    forwarderContractAbi: [],
    botWalletAddress: ''
  })
  const { run } = useCloud();

  const getDefaultTokenMetadata = useCallback(async (tokenAddress: string) => {
    const options = {
      chain: chainHex.Fuji,
      addresses: tokenAddress
    };
    return Web3Api.token
      .getTokenMetadata(options as any)
      .then(tokens => {
        if (tokens && tokens[0]) {
          setDefaultTokenMetadata(tokens[0]);
          return tokens[0]
        }

        return null
      })
      .catch(error => {
        console.log('Error: get default token metadata ', error);
      })
  }, [])

  const getAppContractsMetadata = useCallback(async () => {
    const web3DependenciesResult = await run(cloudFunctionName.web3Dependencies, null, res => res as ContractsMetadata)
    if (!web3DependenciesResult.isSuccess) return null;
    setContractsMetadata(web3DependenciesResult.data);
    return web3DependenciesResult.data;
  }, [])

  useEffect(() => {
    if (!isInitialized) return;

    getAppContractsMetadata()
      .then(data => {
        return data ?
          getDefaultTokenMetadata(data.tokenContractAddress)
            .then(() => true) :
          false;
      })
      .then(success => {
        setIsReady(success);
      })
  }, [isInitialized])

  useEffect(() => {
    setWalletAddress(user?.walletAddress ?? null)
  }, [user?.walletAddress])

  return (
    <dapContext.Provider
      value={{
        walletAddress,
        chainId: chainHex.Fuji,
        defaultTokenMetadata: defaultTokenMetadata,
        isReady,
        tokenContractAddress: contractsMetadata.tokenContractAddress,
        gameContractAddress: contractsMetadata.gameContractAddress,
        relayerContractAddress: contractsMetadata.relayerContractAddress,
        forwarderContractAddress: contractsMetadata.forwarderContractAddress,
        tokenContractAbi: contractsMetadata.tokenContractAbi,
        gameContractAbi: contractsMetadata.gameContractAbi,
        forwarderContractAbi: contractsMetadata.forwarderContractAbi,
        botWalletAddress: contractsMetadata.botWalletAddress
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
